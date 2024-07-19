module Api
  class ApiOrdersController < ActionController::Base
    skip_before_action :verify_authenticity_token
    include ApiHelper

    # GET /api/orders
    def index
      # @orders = Order.all

        user_type = params[:type]
        id = params[:id]

        # Parameters validation
        unless user_type.present? && id.present?
          return render_400_error("Both 'user type' and 'id' parameters are required")
        end

        unless user_type.in?(%w[customer restaurant courier])
          return render_422_error("Invalid user type")
        end

        # Success responses
        orders = Order.user_orders(user_type, id)
        render json: orders.map(&method(:format_order_long)), status: :ok
      end

    # POST /api/orders
    def create
      restaurant_id, customer_id, products = params.values_at(:restaurant_id, :customer_id, :products)

      # Validate required parameters
      unless restaurant_id.present? && customer_id.present? && products.present?
        return render_400_error("Restaurant ID, customer ID, and products are required")
      end

      restaurant = Restaurant.find_by(id: restaurant_id)
      customer = Customer.find_by(id: customer_id)

      # Validate foreign keys exists
      unless restaurant && customer
        return render_422_error("Invalid restaurant or customer ID")
      end

      order = Order.create!(restaurant_id: restaurant_id, customer_id: customer_id, order_status_id: OrderStatus.find_by(name: "pending")&.id)

      # Validate order
      unless order
        return render_422_error("Failed to create order")
      end

      # Validate and create product orders
      products.each do |product_params|
        product = Product.find_by(id: product_params[:id])

        unless product
          order.destroy
          return render_422_error("Invalid product ID")
        end

        order.product_orders.create!(product_id: product.id, product_quantity: product_params[:quantity].to_i, product_unit_cost: product.cost)
      end

      render json: format_order_long(order), status: :created
    end

    # POST /api/order/:id/status
    def set_status
      status = params[:status]
      id = params[:id]

      unless status.present? && status.in?(["pending", "in progress", "delivered"])
        return render_422_error("Invalid status")
      end

      order = Order.find_by(id: id)
      unless order
        return render_422_error("Invalid order")
      end

      order.update(order_status_id: OrderStatus.find_by(name: status)&.id)
      render json: { status: order.order_status.name }, status: :ok
    end

    # POST /api/order/:id/rating
    def set_rating
      rating = params[:restaurant_rating]
      id = params[:id]

      order = Order.find_by(id: id)
      return render_422_error("Invalid order") unless order
      return render_400_error("Restaurant rating required") unless rating.present?
      return render_422_error("Invalid rating") unless rating.between?(1,5)

      order.update(restaurant_rating: rating)
      render json: { restaurant_rating: rating }, status: :ok
    end

    private

    # Formats an order to its long form, in json
    def format_order_long(order)
      {
        id: order.id,
        customer_id: order.customer.id,
        customer_name: order.customer.user.name,
        customer_address: order.customer.address.full_address,
        restaurant_id: order.restaurant.id,
        restaurant_name: order.restaurant.name,
        restaurant_address: order.restaurant.address.full_address,
        courier_id: order.courier&.id,
        courier_name: order.courier&.user&.name,
        status: order.order_status.name,
        products: order.product_orders.map do |po|
          {
            product_id: po.product.id,
            product_name: po.product.name,
            quantity: po.product_quantity,
            unit_cost: po.product_unit_cost,
            total_cost: po.product_quantity * po.product_unit_cost
          }
        end,
        total_cost: order.total_cost,
        created_at: order.created_at,
        updated_at: order.updated_at,
      }
    end
  end
end
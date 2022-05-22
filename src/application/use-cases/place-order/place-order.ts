import ItemRepository from "../../../domain/repository/item-repository";
import Order from "../../../domain/entity/order";
import PlaceOrderInput from "./place-order-input";
import PlaceOrderOutput from "./place-order-output";
import CouponRepository from "../../../domain/repository/coupon-repository";
import OrderRepository from "../../../domain/repository/order-repository";


export default class PlaceOrder {

    constructor (readonly itemRepository: ItemRepository, readonly couponRepository: CouponRepository, readonly orderRepository: OrderRepository) {
    }

    async execute (input: PlaceOrderInput): Promise<PlaceOrderOutput> {
        if (!input || !input.cpf || !input.orderItems || input.orderItems.length === 0) {
            throw new Error('Invalid input');
        }

        const sequence = await this.orderRepository.count() + 1;
        const { cpf, orderItems, couponId, issueDate } = input;
        const order = new Order(cpf, issueDate, sequence);
        
        for (const orderItem of orderItems) {
            const item  = await this.itemRepository.getById(orderItem.itemId);

            if (!item) {
                throw new Error('Item not found');
            }

            order.addItem(item, orderItem.quantity);
        }

        if (couponId) {            
            const coupon = await this.couponRepository.getByCode(couponId);

            if (coupon) {
                order.addCoupon(coupon);
            }
        }

        this.orderRepository.save(order);

        return new PlaceOrderOutput(order.getCode(), order.getTotal());
    }
}

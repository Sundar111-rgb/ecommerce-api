import Cart from '../models/Cart.js';

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [
                    {
                        product: productId,
                        quantity: quantity,
                    },
                ],
            });
        } else {
            const existingItem = cart.items.find(
                item => item.product.toString() === productId,
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity: quantity,
                });
            }

            await cart.save();
        }

        res.status(201).json({
            message: 'Product added to cart',
            cart,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id,
        }).populate('items.product');

        if (!cart) {
            return res.status(200).json({
                message: 'Cart is empty',
                items: [],
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user.id,
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found',
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId,
        );

        await cart.save();

        res.status(200).json({
            message: 'Product removed from cart',
            cart,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                message: 'Quantity must be at least 1',
            });
        }
        
        const cart = await Cart.findOne({
            user: req.user.id,
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found',
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId,
        );

        if (!item) {
            return res.status(404).json({
                message: 'Product not found in cart',
            });
        }

        item.quantity = quantity;

        await cart.save();

        res.status(200).json({
            message: 'Cart quantity updated',
            cart,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id,
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found',
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            message: 'Cart cleared successfully',
            cart,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
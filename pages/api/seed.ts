import { NextApiRequest, NextApiResponse } from 'next';
import { vendorDB } from '@/lib/db/vendors';
import { menuItemDB } from '@/lib/db/menu-items';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // 1. Create Main Canteen
        const canteenId = 'vendor_main_canteen';
        await vendorDB.create(canteenId, {
            name: 'Main Canteen',
            description: 'South Indian & Meals',
            image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000',
            availability_status: 'open',
            menu_items: [],
            rating: 4.5,
            delivery_time_min: 15,
            delivery_time_max: 25
        });

        // 2. Create Coffee Shop
        const coffeeId = 'vendor_coffee_shop';
        await vendorDB.create(coffeeId, {
            name: 'Campus Coffee',
            description: 'Beverages & Snacks',
            image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1000',
            availability_status: 'open',
            menu_items: [],
            rating: 4.8,
            delivery_time_min: 5,
            delivery_time_max: 10
        });

        // 3. Create Menu Items for Main Canteen
        const canteenItems = [
            {
                name: 'Veg Meals',
                description: 'Rice, Sambar, Rasam, Curds, 2 Veggies, Pickle, Papad',
                price: 60,
                category: 'Meals',
                image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=60',
                is_vegetarian: true,
                available: true,
                vendor_id: canteenId,
                rating: 4.5
            },
            {
                name: 'Chicken Biryani',
                description: 'Aromatic basmati rice cooked with tender chicken and spices',
                price: 120,
                category: 'Biryani',
                image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=60',
                is_vegetarian: false,
                available: true,
                vendor_id: canteenId,
                rating: 4.7
            },
            {
                name: 'Masala Dosa',
                description: 'Crispy crepe with potato filling served with chutney and sambar',
                price: 45,
                category: 'South',
                image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=60',
                is_vegetarian: true,
                available: true,
                vendor_id: canteenId,
                rating: 4.6
            }
        ];

        for (const item of canteenItems) {
            const id = `item_${uuidv4()}`;
            await menuItemDB.create(id, item);
            await vendorDB.addMenuItem(canteenId, id);
        }

        // 4. Create Menu Items for Coffee Shop
        const coffeeItems = [
            {
                name: 'Cold Coffee',
                description: 'Classic cold coffee with ice cream',
                price: 40,
                category: 'Juices',
                image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=60',
                is_vegetarian: true,
                available: true,
                vendor_id: coffeeId,
                rating: 4.8
            },
            {
                name: 'Chicken Sandwich',
                description: 'Grilled chicken sandwich with mayo and veggies',
                price: 50,
                category: 'Snacks',
                image_url: 'https://images.unsplash.com/photo-1553909489-cd47e3b20280?auto=format&fit=crop&w=500&q=60',
                is_vegetarian: false,
                available: true,
                vendor_id: coffeeId,
                rating: 4.4
            },
            {
                name: 'Veg Puff',
                description: 'Flaky pastry filled with spiced vegetables',
                price: 15,
                category: 'Snacks',
                image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=60', // Placeholder
                is_vegetarian: true,
                available: true,
                vendor_id: coffeeId,
                rating: 4.2
            }
        ];

        for (const item of coffeeItems) {
            const id = `item_${uuidv4()}`;
            await menuItemDB.create(id, item);
            await vendorDB.addMenuItem(coffeeId, id);
        }

        res.status(200).json({ message: 'Database seeded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to seed database', details: error });
    }
}

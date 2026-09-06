import { pool } from './config/database.js';
import bcryptjs from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create a seller user
    const hashedPassword = await bcryptjs.hash('password123', 10);
    const userResult = await pool.query(
      'INSERT INTO users (email, password, name, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['seller@1fi.com', hashedPassword, '1Fi Seller', '9876543210', '123 Business St']
    );

    const sellerId = userResult.rows[0].id;
    console.log('✓ Seller user created:', sellerId);

    // Products data
    const productsData = [
      {
        name: 'iPhone 17',
        description: 'A premium smartphone with a bright display, powerful performance and an advanced camera system.',
        price: 79999,
        quantity: 50,
        category: 'Mobiles',
        image_url: 'https://images.unsplash.com/photo-1592286927505-2fdc6b9f1c0d?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Galaxy S25 Ultra',
        description: 'A flagship Android phone with a large display, versatile cameras and all-day performance.',
        price: 129999,
        quantity: 35,
        category: 'Mobiles',
        image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'MacBook Pro 14-inch',
        description: 'A powerful professional laptop designed for development, creative work and demanding workflows.',
        price: 149999,
        quantity: 20,
        category: 'Laptops',
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Dell XPS 15',
        description: 'Premium Windows laptop with InfinityEdge display and powerful processors.',
        price: 125999,
        quantity: 25,
        category: 'Laptops',
        image_url: 'https://images.unsplash.com/photo-1588872657840-790ff3bde172?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Sony Bravia 55-inch 4K TV',
        description: 'A cinematic 4K television with vibrant picture quality and smart entertainment features.',
        price: 89999,
        quantity: 15,
        category: 'TVs',
        image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'LG OLED 65-inch TV',
        description: 'Premium OLED display with perfect blacks and stunning color accuracy.',
        price: 149999,
        quantity: 10,
        category: 'TVs',
        image_url: 'https://images.unsplash.com/photo-1618647953883-cc70160abbb1?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Samsung Washing Machine 8kg',
        description: 'Fully automatic front-load washing machine with AI technology.',
        price: 34999,
        quantity: 40,
        category: 'Appliances',
        image_url: 'https://images.unsplash.com/photo-1517957745105-14fc4fef64b9?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'LG Refrigerator 600L',
        description: 'Double door refrigerator with smart inverter technology and frost-free operation.',
        price: 59999,
        quantity: 30,
        category: 'Appliances',
        image_url: 'https://images.unsplash.com/photo-1503407167179-a50900e2da82?auto=format&fit=crop&w=900&q=85',
      },
    ];

    const productIds = [];
    for (const productData of productsData) {
      const result = await pool.query(
        'INSERT INTO products (seller_id, name, description, price, quantity, category, image_url, rating, reviews_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        [sellerId, productData.name, productData.description, productData.price, productData.quantity, productData.category, productData.image_url, 4.5, 120]
      );
      productIds.push(result.rows[0].id);
    }
    console.log(`✓ ${productIds.length} products created`);

    // Add variants for each product
    const variantsData = [
      { productIndex: 0, name: 'Storage', values: [{ value: '128GB', priceAdj: 0 }, { value: '256GB', priceAdj: 10000 }, { value: '512GB', priceAdj: 25000 }] },
      { productIndex: 0, name: 'Color', values: [{ value: 'Black', priceAdj: 0 }, { value: 'Blue', priceAdj: 0 }, { value: 'White', priceAdj: 0 }] },
      { productIndex: 1, name: 'Storage', values: [{ value: '256GB', priceAdj: 0 }, { value: '512GB', priceAdj: 10000 }] },
      { productIndex: 1, name: 'Color', values: [{ value: 'Black', priceAdj: 0 }, { value: 'Gray', priceAdj: 0 }] },
      { productIndex: 2, name: 'RAM', values: [{ value: '16GB', priceAdj: 0 }, { value: '24GB', priceAdj: 50000 }] },
      { productIndex: 2, name: 'Storage', values: [{ value: '512GB SSD', priceAdj: 0 }, { value: '1TB SSD', priceAdj: 30000 }] },
      { productIndex: 4, name: 'Size', values: [{ value: '55-inch', priceAdj: 0 }, { value: '65-inch', priceAdj: 35000 }] },
      { productIndex: 5, name: 'Size', values: [{ value: '55-inch', priceAdj: 0 }, { value: '65-inch', priceAdj: 40000 }, { value: '77-inch', priceAdj: 85000 }] },
    ];

    let variantCount = 0;
    for (const variantSet of variantsData) {
      const productId = productIds[variantSet.productIndex];
      for (const variant of variantSet.values) {
        await pool.query(
          'INSERT INTO product_variants (product_id, variant_name, variant_value, price_adjustment, stock) VALUES ($1, $2, $3, $4, $5)',
          [productId, variantSet.name, variant.value, variant.priceAdj, 100]
        );
        variantCount++;
      }
    }
    console.log(`✓ ${variantCount} product variants created`);

    // Add EMI plans for each product
    const emiPlans = [
      { months: 3, rate: 0, label: '3-Month Plan' },
      { months: 6, rate: 0, label: '6-Month Plan' },
      { months: 9, rate: 0, label: '9-Month Plan' },
      { months: 12, rate: 0, label: '12-Month Plan - Recommended' },
      { months: 18, rate: 0.5, label: '18-Month Plan' },
      { months: 24, rate: 0.5, label: '24-Month Plan' },
    ];

    let emiCount = 0;
    for (const productId of productIds) {
      // Get product price
      const productResult = await pool.query('SELECT price FROM products WHERE id = $1', [productId]);
      const productPrice = productResult.rows[0].price;

      for (const plan of emiPlans) {
        const emiAmount = Math.ceil((productPrice * (1 + plan.rate / 100)) / plan.months);
        const processingFee = Math.ceil(productPrice * 0.02); // 2% processing fee

        await pool.query(
          'INSERT INTO emi_plans (product_id, plan_name, tenure_months, interest_rate, emi_amount, processing_fee) VALUES ($1, $2, $3, $4, $5, $6)',
          [productId, plan.label, plan.months, plan.rate, emiAmount, processingFee]
        );
        emiCount++;
      }
    }
    console.log(`✓ ${emiCount} EMI plans created`);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();

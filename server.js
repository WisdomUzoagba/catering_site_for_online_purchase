const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const menuData =  {
  breakfast: [
    {
        name: 'Avocado Toast',
        price: 12.99,
        description: 'Sourdough bread with smashed avocado, cherry tomatoes, feta cheese, and a poached egg',
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Avocado%20Toast%20for%20breakfast'
    },
    {
        name: 'Pancake Stack',
        price: 10.99,
        description: 'Fluffy buttermilk pancakes with maple syrup, fresh berries, and whipped cream',
        image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Pancake%20Stack%20for%20breakfast'
    },
    {
        name: 'Breakfast Burrito',
        price: 14.99,
        description: 'Scrambled eggs, black beans, chorizo, cheese, and avocado wrapped in a flour tortilla',
        image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Breakfast%20Burrito%20for%20breakfast'
    },
    {
        name: 'Fruit Smoothie',
        price: 8.99,
        description: 'Blend of fresh berries, banana, yogurt, and honey',
        image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Fruit%20Smoothie%20for%20breakfast'
    }
],
  lunch: [
    {
      name: 'Quinoa Salad',
      price: 15.99,
      description: 'Organic quinoa with roasted vegetables, feta cheese, and lemon-tahini dressing',
      image: 'images/quinoa_salad.jpg" alt="Quinoa Salad',
      orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Quinoa%20Salad%20for%20lunch'
    },
    {
      name: 'Chicken Wrap',
      price: 16.99,
      description: 'Grilled chicken, mixed greens, tomatoes, and avocado in a whole wheat wrap',
      image: 'images/chicken_wrap.jpg" alt="Chicken Wrap',
      orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Chicken%20Wrap%20for%20lunch'
    },
    {
      name: 'Beef Burger',
      price: 18.99,
      description: 'Grass-fed beef patty with cheddar, lettuce, tomato, and special sauce on a brioche bun',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Chicken%20Wrap%20for%20lunch'
    }
  ],
  dinner: [
    {
      name: 'Salmon Fillet',
      price: 24.99,
      description: 'Pan-seared salmon with lemon butter sauce, roasted potatoes, and asparagu',
      image: 'images/salmon_fillet.jpg" alt="Salmon Fillet',
      orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Salmon%20Fillet%20for%20dinner'
    },
    {
      name: 'Pasta Carbonara',
      price: 19.99,
      description: 'Classic spaghetti with pancetta, parmesan, and creamy egg sauce',
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Salmon%20Fillet%20for%20dinner'
    },
    {
      name: 'Steak Dinner',
      price: 29.99,
      description: 'Grass-fed ribeye with roasted garlic mashed potatoes and seasonal vegetables',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      orderLink: 'https://wa.me/1234567890?text=I%20would%20like%20to%20order%20Salmon%20Fillet%20for%20dinner'
    }
  ]
};

app.get('/api/menu', (req, res) => {
  res.json(menuData);
});

app.listen(PORT, (req, res) => {
  console.log(`Server is listening at localhost://${PORT}`);
  
});
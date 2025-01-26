export interface StockItem {
  id: string
  name: string
  category: string
  price: number
  inStock: boolean
  maxStock: number
  alternatives: string[]
  translations: string[]
}

export const stockData: StockItem[] = [
  {
    id: "1",
    name: "Milk",
    category: "Dairy",
    price: 3.99,
    inStock: true,
    maxStock: 10,
    alternatives: ["Almond milk", "Soy milk"],
    translations: ["Leche", "Lait"],
  },
  {
    id: "2",
    name: "Bread",
    category: "Bakery",
    price: 2.49,
    inStock: true,
    maxStock: 15,
    alternatives: ["Whole wheat bread", "Gluten-free bread"],
    translations: ["Pan", "Pain"],
  },
  {
    id: "3",
    name: "Apples",
    category: "Produce",
    price: 1.99,
    inStock: true,
    maxStock: 20,
    alternatives: ["Pears", "Bananas"],
    translations: ["Manzanas", "Pommes"],
  },
  {
    id: "4",
    name: "Chicken",
    category: "Meat",
    price: 5.99,
    inStock: false,
    maxStock: 5,
    alternatives: ["Turkey", "Tofu"],
    translations: ["Pollo", "Poulet"],
  },
  {
    id: "5",
    name: "Pasta",
    category: "Grains",
    price: 1.49,
    inStock: true,
    maxStock: 25,
    alternatives: ["Rice", "Quinoa"],
    translations: ["Pasta", "Pâtes"],
  },
  {
    id: "6",
    name: "Tomatoes",
    category: "Produce",
    price: 2.99,
    inStock: true,
    maxStock: 12,
    alternatives: ["Canned tomatoes", "Bell peppers"],
    translations: ["Tomates", "Tomates"],
  },
  {
    id: "7",
    name: "Cheese",
    category: "Dairy",
    price: 4.99,
    inStock: true,
    maxStock: 8,
    alternatives: ["Vegan cheese", "Nutritional yeast"],
    translations: ["Queso", "Fromage"],
  },
  {
    id: "8",
    name: "Eggs",
    category: "Dairy",
    price: 3.49,
    inStock: true,
    maxStock: 15,
    alternatives: ["Egg substitute", "Tofu"],
    translations: ["Huevos", "Œufs"],
  },
  {
    id: "9",
    name: "Cereal",
    category: "Breakfast",
    price: 3.99,
    inStock: true,
    maxStock: 20,
    alternatives: ["Oatmeal", "Granola"],
    translations: ["Cereal", "Céréales"],
  },
  {
    id: "10",
    name: "Bananas",
    category: "Produce",
    price: 0.99,
    inStock: true,
    maxStock: 30,
    alternatives: ["Apples", "Oranges"],
    translations: ["Plátanos", "Bananes"],
  },
]

export const getSeasonalItems = (): StockItem[] => {
  return [
    {
      id: "11",
      name: "Pumpkin",
      category: "Produce",
      price: 3.99,
      inStock: true,
      maxStock: 10,
      alternatives: ["Butternut squash", "Sweet potato"],
      translations: ["Calabaza", "Citrouille"],
    },
    {
      id: "12",
      name: "Cranberries",
      category: "Produce",
      price: 2.99,
      inStock: true,
      maxStock: 15,
      alternatives: ["Dried cranberries", "Cranberry sauce"],
      translations: ["Arándanos", "Canneberges"],
    },
  ]
}


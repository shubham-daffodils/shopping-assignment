import ShoppingList from "../components/ShoppingList"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700">
      <ShoppingList />
    </main>
  )
}


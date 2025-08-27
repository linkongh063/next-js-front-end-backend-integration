import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">ecomx</h3>
          <p className="text-sm text-gray-600">
            Quality products, curated for you.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="text-gray-600 hover:underline">Home</Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-600 hover:underline">Products</Link>
            </li>
            <li>
              <Link href="/categories" className="text-gray-600 hover:underline">Categories</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Contact</h4>
          <p className="text-sm text-gray-600">support@ecomx.example</p>
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} ecomx</p>
        </div>
      </div>
    </footer>
  );
}

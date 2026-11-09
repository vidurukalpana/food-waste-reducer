import { useParams } from 'react-router'

export function ItemDetailPage() {
  const { id } = useParams()
  return <h1 className="text-2xl font-bold">Item {id}</h1>
}

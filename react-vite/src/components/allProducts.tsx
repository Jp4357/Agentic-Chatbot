import { useGetAllProductQuery, type Product } from "../app/dummyData/dummyData";

const AllProducts = () => {
    const { data, isError, isLoading } = useGetAllProductQuery();

    if (isError) {
        return <h1>OOOhNoooo we got an error</h1>;
    }

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            {data?.products.map((p: Product) => (
                <div key={p.id}>
                    <h1>{p.title}</h1>
                    <p>{p.description}</p>
                </div>
            ))}
        </div>
    );
};

export default AllProducts;
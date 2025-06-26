import { useAddNewProductMutation, type Product } from "../../services/api/dummyData/dummyData";


const AddNewProduct = () => {
    const [addNewProduct, { data, error, isLoading }] = useAddNewProductMutation();

    if (error) {
        return <h1>ERROR</h1>;
    }

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    const handleAddProduct = async () => {
        try {
            const newProductData: Partial<Product> = {
                id: 1,
                title: "Amazing T-Shirt",
                description: "This is one of the best and amazing t-shirt in the market",
            };

            await addNewProduct(newProductData).unwrap(); // .unwrap() lets us catch errors in try/catch
        } catch (err) {
            console.error("Error adding new product:", err);
        }
    };

    return (
        <div>
            <h1>{data?.id}</h1>
            <h1>{data?.title}</h1>
            <h1>{data?.description}</h1>

            <button onClick={handleAddProduct} disabled={isLoading}>
                Add New Product
            </button>
        </div>
    );
};

export default AddNewProduct;
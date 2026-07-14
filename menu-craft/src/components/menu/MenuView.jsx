import MenuHero from "./MenuHero";
import CategoryTabs from "./CategoryTabs";
import ProductGrid from "./ProductGrid";
import EmptyMenu from "./EmptyMenu";

function MenuView({
    menu,
    preview = false,
    selectedCategory,
    onSelectCategory,
}) {

    return (

        <>

            <MenuHero
                restaurant={menu.restaurante}
                preview={preview}
            />

            <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

                <CategoryTabs
                    categories={menu.categorias}
                    selectedCategory={selectedCategory}
                    onSelectCategory={onSelectCategory}
                    preview={preview}
                />

                {
                    menu.categorias.length === 0
                        ? (
                            <EmptyMenu />
                        )
                        : (
                            <ProductGrid
                                categories={menu.categorias}
                                selectedCategory={selectedCategory}
                                preview={preview}
                            />
                        )
                }

            </main>

            <footer className="border-t border-gray-200 py-6 mt-8">

                <p className="text-center text-xs text-gray-400">

                    MenuCraft — Tu carta digital, en un escaneo.

                </p>

            </footer>

        </>

    );

}

export default MenuView;    
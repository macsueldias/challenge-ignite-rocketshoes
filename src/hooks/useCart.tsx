import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';
import { useQuery } from 'react-query';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  products: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([])

  const { isLoading, error, refetch } = useQuery(
    'products',
      async () => {
        const response = await api.get('/products')

        const data = await response.data
        setProducts(data)
      },
    )
      
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart)
    }
    
    // console.log(storagedCart)
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const product = products.filter(product => product.id === productId)[0]
      setCart((state) => [...state, product])
    } catch {
      console.log("Erro ao adicionar o produto no carrinho, favor entrar em contato com o suporte!")
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const products = cart.find((product) => product.id !== productId)
      console.log(products)
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount, products }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

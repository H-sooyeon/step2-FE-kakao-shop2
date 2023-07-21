import { useCallback, useEffect, useState } from "react";
import Box from "../atoms/Box";
import CartItem from "../atoms/CartItem";
import { comma } from "../../utils/convert";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { updateCart } from "../../apis/cart";
import * as Cart from '../../styles/molecules/CartList';

const CartList = ({data}) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [updatePayload, setUpdatePayload] = useState([]);

    const {mutate} = useMutation({
        mutationFn: updateCart,
    });

    useEffect(() => {
        setCartItems(data?.data?.response?.products);
        setTotalPrice(data?.data?.response?.totalPrice);
    }, [data]);

    /**
     * 옵션의 수량 변경과 가격 변경을 관리
     * @param {number} optionId : 옵션의 아이디
     * @param {number} quantity : 옵션의 수량
     * @param {number} price : 옵션 가격
     */
    const handleOnChangeCount = useCallback((optionId, quantity, price) => {
        setUpdatePayload((prev) => {
            const isExist = prev.find((item) => item.cartId === optionId);

            if(isExist) {
                return [
                    ...prev.filter((item) => item.cartId !== optionId),
                    {
                        cartId: optionId,
                        quantity,
                    }
                ]
            };

            return[
                ...prev,
                {
                    cartId: optionId,
                    quantity,
                }
            ]
        });
        setTotalPrice((prev) => prev + price);
        setCartItems((prev) => {
            return prev.map((item) => {
                return {
                    ...item,
                    carts: item.carts.map((cart) => {
                        if(cart.id === optionId) {
                            return {...cart, quantity};
                        }
                        return cart;
                    })
                }
            })
        });
    }, [cartItems]);

    const handleOnDeleteOption = useCallback((optionId, quantity, price) => {
        setUpdatePayload((prev) => {
            const isExist = prev.find((item) => item.cartId === optionId);

            if(isExist) {
                return [
                    ...prev.filter((item) => item.cartId !== optionId),
                    {
                        cartId: optionId,
                        quantity: 0,
                    }
                ]
            };

            return[
                ...prev,
                {
                    cartId: optionId,
                    quantity: 0,
                }
            ]
        });
        setTotalPrice((prev) => prev - price * quantity);
        setCartItems((prev) => {
            return prev.map((item) => {
                return {
                    ...item,
                    carts: item.carts.map((cart) => {
                        if(cart.id === optionId) {
                            return {...cart, quantity: 0};
                        }
                        return cart;
                    })
                }
            })
        });
    }, [cartItems]);

    const getTotalCartCountIncludeOptions = useCallback(() => {
        let count = 0;
        cartItems.forEach((item) => {
            item.carts.forEach((cart) => {
                count += cart.quantity;
            });
        });

        return count;
    }, [cartItems]);

    useEffect(() => {
        mutate(updatePayload, {
            onSuccess: () => {
                console.log('장바구니 수정 성공!');
            },
            onError: (error) => {
                console.error(error);
            }
        });
    }, [updatePayload]);
    
    return(
        <Cart.ListContainer>
            <Cart.ListBox>
            <Box>
                <Cart.Title>장바구니</Cart.Title>
            </Box>
            <Box>
                <Cart.OptionContainer>
                {/* 상품별 장바구니 */}
                {Array.isArray(cartItems) &&
                    cartItems.map((item) => {
                        return (
                            <CartItem
                                key={item.id}
                                item={item}
                                onChange={handleOnChangeCount}
                                onDelete={handleOnDeleteOption}
                            />
                        )
                    })}
                </Cart.OptionContainer>
            </Box>
            <Box>
                <Cart.TotalPrice>
                    <span>주문 예상금액</span>
                    <span style={{color: '#288CFF'}}>{comma(totalPrice)}원</span>
                </Cart.TotalPrice>
            </Box>
            <Cart.OrderButton onClick={() => {
                //update cart
                //navigate to order page
                mutate(updatePayload, {
                    onSuccess: () => {
                        navigate("/order");
                    },
                    onError: (error) => {
                        console.error(error);
                    }
                });
            }}>
                <span>총 {cartItems ? getTotalCartCountIncludeOptions() : 0}건 주문하기</span>
            </Cart.OrderButton>
            </Cart.ListBox>
        </Cart.ListContainer>
    );
};

export default CartList;
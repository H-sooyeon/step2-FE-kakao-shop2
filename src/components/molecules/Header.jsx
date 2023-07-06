import img from '../../assets/logoKakao.png';
import cart from "../../assets/cart.png";
import * as Head from '../../styles/molecules/Header';
import ImgLink from "../atoms/ImgLink";
import LinkText from "../atoms/LinkText";

const Header = () => {
    return(
        <Head.Header>
            <Head.Container>
                <ImgLink to="/" src={img} alt="톡 쇼핑하기" className="header-logo"/>
                <Head.MenuUtil>
                    <ImgLink to="/cart" src={cart} alt="장바구니" className="header-cart"/>
                    <LinkText text="로그인" to="/login" className="header-login"/>
                </Head.MenuUtil>
            </Head.Container>
        </Head.Header>
    );
};

export default Header;
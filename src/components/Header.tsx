import {Button, useDisclosure, HStack, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import LoginModal from "./LoginModal.tsx";
import Register from "./Register.tsx";
import { Link } from "react-router-dom";

export default function Header() {
    const [isLogin, setIsLogin] = useState(false); // 로그인 여부
    const [username, setUsername] = useState(""); // 로그인된 유저 이름
    // useDisclosure/ Login 모달의 열고 닫는 상태를 관리 훅
    const {
        isOpen:isLoginModalOpen,
        onOpen:onLoginModalOpen,
        onClose:onLoginModalClose
    } = useDisclosure();

       // Register 모달 온/오프 만들기위한 훅
    const{
        isOpen:isRegisterOpen,
        onOpen:onRegisterOpen,
        onClose:onRegisterClose
    } = useDisclosure();

    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 컴포넌트가 처음 렌더링될 때 실행  마지막에 ,[] 이거는 딱 1번만 실행하라는 의미
    useEffect(() => {
        // 토큰을 localStorage.getItem("access") 에서 가져옴 (로그인 했을때 이미 로컬스토리지에 저장함)
        const token = localStorage.getItem("access");
        // 토큰이 있는지 확인 하고 (token이 있으면 true), 유저 정보를 백엔드에서 받아옴
        if (token) {
            // /me API로 사용자 정보 가져오기
            fetch("http://localhost:8000/api/v1/user/me/", {
                // 백엔드에서  header를 통해 사용자가 맞는지 확인(판단)
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            // fetch 요청 응답(백엔드에서받은) 결과를 res에 넣어줌
            .then(res =>{
                // 유저 정보(백엔드), 즉 res 안에 있는 토큰이 만료 됐거나 잘못됐으면
                if(!res.ok){
                    // 에러메세지를 전달
                    throw new Error("인증 실패!");
                }
                // 문제 없으면 res를 json으로 파싱해줌
                return res.json();
            })
                // json으로  파싱한 res 안의 데이터에서
                .then(data => {
                    // setUsername에는 username을 받아옴 이후 usestate를 통해 username에([*username*,set...]) 저장됨
                    setUsername(data.username);
                    // 마찬가지로 기본 false인 isLogin을 setIsLogin을 통해 true로 바꿔줌
                    setIsLogin(true);
                })
                // 에러가 났을경우 위에 작업의 반대
                .catch(()=>{
                    setIsLogin(false);
                    setUsername("");
                });
        }
    },[]);

    // 로그아웃 핸들러 함수
    const handleLogout = () => {
        // 로그아웃시 로컬스토리지에서 token을 삭제함
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // isLogin을 false로 되돌려놓음
        setIsLogin(false);
        setUsername("");
    }

    return (
        <HStack spacing={2} justifyContent="flex-end">
            {/*isLogin true/false 를 통해 스위치처럼 UI를 변경 (기본 false)*/}
            {/*!isLogin 이기때문에 false가 true로 인식돼서 첫번째 먼저실행*/}
            {!isLogin ? (
                <> {/*isLogin이 false 일 경우 이 부분을 보여줌*/}
                    {/*로그인 버튼 (모달 열기 트리거(모달여는부분))*/}
            <Button colorScheme={"teal"} onClick={onLoginModalOpen}>
                로그인하샘
            </Button>
            {/* 모달 컴포넌트에 상태 전달 */}
            <LoginModal
        isOpen={isLoginModalOpen}
        onClose={onLoginModalClose}
            />

            {/*로그인 버튼 (모달 열기 트리거(모달여는부분) onOpen(onRegisterOpen) -> isOpen(isRegisterOpen)을 true로 만들어줌)*/}
            <Button colorScheme={"teal"} onClick={onRegisterOpen}>
                회원가입 하실?
            </Button>
            <Register
                isOpen={isRegisterOpen}
                /*onClose가 되면 isOpen이 false가 됨*/
                onClose={onRegisterClose}
            />
                </>
            ):(<>{/*isLogin이 true 일 경우 이 부분을 보여줌*/}
                {/*usestate를 통해 저장된 username을 가져옴*/}
                <Text fontWeight={'bold'}>{username}님 환영합니다</Text>
                {/*내 정보 보기 버튼*/}
                <Button colorScheme={"blue"} onClick={()=>navigate("/profile")}>
                    내 정보
                </Button>
                {/*logout 버튼시  handleLogout 함수가 실행되며 토큰을 지우고 islogin을 false로 복구*/}
                <Button colorScheme={"red"} onClick={handleLogout}>
                    로그아웃
                </Button>
                    <Link to={`/`}><Button colorScheme={"green"}>Home</Button></Link>
            </>
            )}
        </HStack>
    )
}



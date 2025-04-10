import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    ModalCloseButton,Button, FormControl,FormLabel,Input,useToast,Box,
} from "@chakra-ui/react";


import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';


// 타입 스크립트로 인해 isOpen과 onClose가 뭔지 알려줘야함
interface LoginModalProps{
    isOpen:boolean;
    onClose:()=>void;
}


//모달 + 로그인 기능을 하나의 컴포넌트로 정의
export default function LoginModal({isOpen:isLoginModalOpen,onClose:onLoginModalClose}:LoginModalProps) {
    const [username, setUsername] = useState(""); //유저네임 저장
    const [password, setPassword] = useState(""); //비빌번호 저장

    // useToast 알림창 (성공,에러 등 메시지 띄우기)
    const toast = useToast(); //에러 메세지 보여줌
    const navigate = useNavigate(); //페이지 이동

    //로그인 요청 함수
    const handleLogin = async (e:React.FormEvent)=>{
        e.preventDefault(); //전체 새로고침 방지
        try {
            const res = await axios.post("http://localhost:8000/api/token/", {
                username: username,
                password: password,
            });
            // 로컬 스토리지에 엑세스와 리프레시 코드들을 저장해줌
            localStorage.setItem("access",res.data.access);
            localStorage.setItem("refresh",res.data.refresh);

            toast({
                title:"login success", // 성공 메세지
                status:"success", // 성공시 초록색
                duration:3000, // 3초간 표시
                isClosable:true, // 닫기 버튼 표시
            });

            // 로그인에 성공하면 아래 명령실행
            onLoginModalClose(); //모달 닫기
            window.location.reload();// 로그인 성공하면 자동으로 새로고침 해줌(로그인 된걸보이기위함)
            navigate("/"); //홈으로 이동

            //실패시 아래명령 실행
        } catch (err) {
            toast({
                title:"login failed", //실패 메세지
                status:"error", // 실패시 빨간색
                duration:3000, // 3초간 표시
                isClosable:true, // 닫기 버튼 표시
            });
        }
    };
    return (
        <Box>
        {/*모달 전체 구조*/}
            {/*Modal 모달 창 전체의 틀 (팝업을 띄우는 가장바깥 컨테이너)*/}
            <Modal isOpen={isLoginModalOpen} onClose={onLoginModalClose}>
                {/*ModalOverlay 배경 어두운 레이어 (모달 뒤의 흐림 처리용)*/}
                <ModalOverlay/>
                    {/*ModalContent 모달의 실제 내용이 들어가는 영역(하얀 박스)*/}
                    <ModalContent>
                        {/*ModalHeader 모달의 제목 부분*/}
                        <ModalHeader>로그인</ModalHeader>
                        {/*ModalCloseButton 오른쪽 상단 X 닫기 버튼*/}
                        <ModalCloseButton />
                        {/*내부에 있는 로그인 버튼을 누르면 handleLogin 함수 실행*/}
                        <form onSubmit={handleLogin}>
                            {/*ModalBody 모달의 본문, 입력창이나 메시지 등...*/}
                            <ModalBody pb={6}>
                                {/*FormControl 폼 한줄 감싸는 컨테이너*/}
                                <FormControl>
                                    {/*FormLabel 입력창 위에 붙는 라벨*/}
                                    <FormLabel>아이디</FormLabel>
                                    {/*Input 사용자 입력 필드*/}
                                    <Input
                                        type="text"
                                        placeholder={"아이디를 입력하세요"}
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel>비밀번호</FormLabel>
                                    <Input
                                    type={"password"}
                                    placeholder={"비밀번호를 입력하세요"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    />
                                </FormControl>
                            </ModalBody>
                            {/*ModalFooter 모달 하단 부분, 보통은 버튼들의 위치*/}
                            <ModalFooter>
                                {/*Button Chakra의 기본 버튼 이 버튼을 누르면 type="submit"을 전달,
                                그럼 form 의 onSubmit(handleLogin) 함수가 실행됨*/}
                                <Button colorScheme={"teal"} mr={3} type={"submit"}>
                                    로그인
                                </Button>
                                <Button onClick={onLoginModalClose}>
                                    취소
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
            </Modal>
        </Box>
    )

}
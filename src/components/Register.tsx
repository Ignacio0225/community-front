import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    ModalCloseButton,Button, FormControl,FormLabel,Input,useToast,Box,HStack
} from "@chakra-ui/react";


import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';

// 구조를 직접 알려줘야함 타입스크립트
interface RegisterProps{
    isOpen:boolean;
    onClose:()=>void;
}



export default function Register({isOpen:isRegisterOpen,onClose:onRegisterClose}:RegisterProps) {
    // 유저네임 저장용
    const [username, setUsername] = useState("");
    // 비밀번호 저장용
    const [password, setPassword] = useState("");
    // 확인용 비밀번호 저장용
    const [confirmPassword, setConfirmPassword] = useState("");
    // 이메일 저장용
    const [email, setEmail] = useState("");
    // 이름 저장용
    const [name, setName] = useState("");
    // 알림창 라이브러리
    const toast = useToast();
    // 페이지 이동을 위해 사용
    const navigate=useNavigate();
    //로그인 버튼 클릭 시 실행되는 함수 여기서 e라는 변수를 설정해주는데 그건 폼이벤트가 발생했을때를 뜻함 ,
    // "e"(event) 발생시 새로고침을 막아줌(preventDefault)
    const handleRegister = async (e:React.FormEvent) => {
        e.preventDefault();

        // 비밀번호 확인 절차
        if (password !== confirmPassword) {
            toast({
            title:"PW error", // 제목
            description:"Check password", // 내용
            status:"error", // error 면 빨간색, //success 면 초록색
            duration:3000, // 3초동안 유지
            isClosable:true, // 닫기 버튼 표시
        }); return // 여기서 멈춤
        // 비밀번호 유효성 확인 절차
        } else if (password.length < 8 || password.length > 16){
                toast({
                title:"8~16자 이내로 작성해주세요",
                description:"8~16자 이내로 작성해주세요",
                status:"error",
                duration:3000,
                isClosable:true,
            });
                return; //여기서 멈춤
            }

        // res 변수에 post 요청 해주는걸 담음, (res를 꼭 사용하지 않는다 해도 post 요청은 진행)
        // const res = await ~~~~~ 필요 없어서 지움
        try{
            await axios.post("http://localhost:8000/api/v1/user/register/",{
                // axios를 사용했기 때문에 method를 따로 알려줄 필요 없고 json파일로 바디에 파싱 해줄 필요도 없음(Profile.tsx 참고)
                username:username,
                password:password,
                email:email,
                name:name,
            },);


            //회원가입 성공 알림
            toast({
                title:"Success",
                description:"Successfully registered",
                status:"success",
                duration:3000,
                isClosable:true,
            });

            onRegisterClose(); // 성공시 모달 종료
            navigate("/"); // 성공시 Home 페이지로 이동

        }catch(err){
            toast({
                title:"Error",
                description:"Error",
                status:"error",
                duration:3000,
                isClosable:true,
            });
        }
    };
    return(
        <Box>
            {/*모달 전체 구조*/}
            {/*Modal 모달 창 전체의 틀 (팝업을 띄우는 가장바깥 컨테이너) onClose -> isOpen을 false로 만들어줌*/}
            <Modal isOpen={isRegisterOpen} onClose={onRegisterClose}>
                {/*ModalOverlay 배경 어두운 레이어 (모달 뒤의 흐림 처리용)*/}
                <ModalOverlay/>
                    {/*ModalContent 모달의 실제 내용이 들어가는 영역(하얀 박스)*/}
                    <ModalContent>
                        {/*ModalHeader 모달의 제목 부분*/}
                        <ModalHeader>회원가입</ModalHeader>
                        {/*ModalCloseButton 오른쪽 상단 X 닫기 버튼 <ModalCloseButton /> 이거랑 동일*/}
                        <ModalCloseButton/>
                        {/*내부에 있는 로그인 버튼을 누르면 handRegister 함수 실행*/}
                        <form onSubmit={handleRegister}>
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
                            <FormControl>
                                <FormLabel>비밀번호</FormLabel>
                            <Input
                            type="password"
                            placeholder={"비밀번호를 입력하세요"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            />
                            </FormControl>
                            <FormControl>
                                <FormLabel>비밀번호 확인</FormLabel>
                            <Input
                            type="password"
                            placeholder={"비밀번호를 한번 더 입력하세요"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                            <Input
                            type="email"
                            placeholder={"Email을 입력하세요"}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                            <Input
                            type="text"
                            placeholder={"이름을 입력하세요"}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            />
                            </FormControl>
                        </ModalBody>
                        {/*ModalFooter 모달 하단 부분, 보통은 버튼들의 위치*/}
                        <ModalFooter>
                            {/*Button 들의 사이 거리를 벌려주기 위해 사용*/}
                            <HStack spacing={2}>
                                {/*Button Chakra의 기본 버튼,  이 버튼을 누르면 type="submit"을 전달,
                                그럼 form 태그 의 onSubmit(handleRegister) 함수가 실행됨*/}
                                <Button colorScheme={"teal"} type="submit">
                                회원가입
                                </Button>
                                <Button colorScheme={"red"} onClick={onRegisterClose}>
                                취소
                                </Button>
                            </HStack>
                        </ModalFooter>
                            </form>
                    </ModalContent>
            </Modal>
        </Box>
    )
}



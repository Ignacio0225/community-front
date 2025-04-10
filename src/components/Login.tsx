import {
    Box, Button, FormControl,
    FormLabel, Heading,
    Input, useToast,
} from '@chakra-ui/react'
import React,{useState} from 'react'; // 상태값 저장을 위한 훅
import {useNavigate} from "react-router-dom"; // 페이지 이동을 위한 훅
import axios from "axios"; //HTTP 요청을 위한 라이브러리


//로그인 컴포넌트 정의
function Login(){
    //입력창 값 상태로저장
    const [username,setUsername] = useState(""); //아이디 입력값
    const [password,setPassword] = useState(""); //비밀번호 입력값

    const navigate = useNavigate(); //페이지 이동 함수
    const toast = useToast(); //알림(toast) 보여주기 함수

    //로그인 버튼 클릭 시 실행되는 함수 여기서 e라는 변수를 설정해주는데 그건 폼이벤트가 발생했을때를 뜻함 , e 발생시 새로고침을 막아줌
    const handleLogin = async (e: React.FormEvent) =>{
        e.preventDefault(); //기본 동작(페이지 새로고침) 방지

        try{
            //장고 백엔드에 로그인 요청(POST /api/token/)
            const res = await axios.post(
                "http://localhost:8000/api/token/",{
                    username:username,
                    password:password
                });

            // 받아온 access, refresh 토큰을 브라우져에 저장
            localStorage.setItem('access',res.data.access);
            localStorage.setItem('refresh',res.data.refresh);

            // 로그인 성공 알림창 표시
            toast({
                title:"login success", //알림 텍스트
                status:"success", //초록색 성공 스타일
                duration:3000, // 3초간 표시
                isClosable:true, // 닫기 버튼 표시
            });
            //HOME 페이지로 이동
            navigate("/");
        } catch (err) {
            //로그인 실패시 에러 알림창 표시
            toast({
                title:"login failed", //알림 텍스트
                description:"Check your ID or PW", // 알림 내용(추가)
                status:"error", // 빨간색 에러 스타일
                duration:3000, // 3초간 표시
                isClosable:true, // 닫기 버튼 표시
            });
        }
    };
    // 화면에 보여지는 부분 (JSX)
    return(
        <Box maxW={'md'} mx={'auto'} mt={'10'}>
        {/*제목*/}
            <Heading mb={6}>로그인</Heading>
        {/*로그인 폼*/}
            <form onSubmit={handleLogin}>
            {/*아이디 입력 필드*/}
                <FormControl mb={4}>
                    <FormLabel>아이디</FormLabel>
                    <Input
                    type="text"
                    value={username}
                    /* e는 ChangeEvent 체인지가 작동할때 생기는 이벤트.타겟.벨류를 가져오라는말 */
                    onChange={(e)=>
                        setUsername(e.target.value)} // 입력값 저장
                    placeholder={"아이디를 입력하세요"}
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>비밀번호</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e)=>
                            setPassword(e.target.value)} // 입력값 저장
                        placeholder={"비밀번호를 입력하세요"}
                        />
                </FormControl>
                {/*로그인 버튼*/}
                <Button
                    type="submit"
                    colorScheme={"teal"}
                    width={"full"}>
                    로그인
                </Button>
            </form>
        </Box>
    )
};

// 외부에서 이 컴포넌트를 사용할 수 있도록 내보냄
export default Login;
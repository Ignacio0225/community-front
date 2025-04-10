
import {Box, FormControl, FormLabel, Heading, useToast, Input,Button} from "@chakra-ui/react"

import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Profile(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(()=>{
        const token = localStorage.getItem("access");
        //token이 없으면 아무것도 하지않고 반환 있으면 계속진행
        if(!token) return;
        // 백엔드에서 user/me 정보를 가져옴
        fetch("http://localhost:8000/api/v1/user/me/",{
            // 백엔드에서 header를 통해 사용자가 맞는지 확인(판단)
            headers:{
                Authorization: `Bearer ${token}`,
            },
        // fetch에서 응답을 받아와서 res에 넣어줌
        }).then((res) =>{
            if(!res.ok) throw new Error ("유저 정보 불러오기 실패"); //응답이 ok가 아니라면 에러
            return res.json(); // ok면 json으로 파싱
        //json을 받아와서 data에 넣어줌
        }).then((data)=>{
            setName(data.name); // 받아온 정보를 setName 에 넣음
            setEmail(data.email); // 받아온 정보를 setEmail 에 넣음

        }).catch(()=>{
            toast({
                title:"정보불러오기 실패",
                status:"error",
                duration:3000,
                isClosable:true,
            });
        });
    }, []);
     // 저장 버튼 클릭 시 실행되는 함수 async를 사용하면 await 를 사용할 수 있게해줌
    const handleSave = async ()=>{
 ;
        const token = localStorage.getItem("access");
        if (!token) return;
        try {
            // await를 사용하면서 작업이 끝날때까지 기다림을 알려줌
            const res=await fetch("http://localhost:8000/api/v1/user/me/", {
                // fetch를 사용해서 메소드를 직접 알려줘야함
                method: "PUT",
                headers:{
                    // 컨텐츠를 json 형식으로 보낼거라는걸 알려줌 (fetch를 사용했기때문에)
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`,
                },
                // fetch는 body에 문자열만 보낼 수 있기때문에 주어진 객체를 문자열로 파싱해서 전달 해줌 (fetch를 사용했기때문에)
                body: JSON.stringify({
                    name: name,
                    email: email,
                }),
            });
            // 응답이 ok가 아니라면 에러 발생해줌
            if(!res.ok) throw new Error("수정 실패");
            // 성공시 메세지전송
            toast({
                title:"수정 성공",
                status:"success",
                isClosable:true,
            });
            // 성공시 홈으로 복귀
            navigate("/")
        }catch(err){
            // 실패시 에러 메세지 전송
            toast({
                title:"수정 실패",
                status:"error",
                isClosable:true,
            });
        }
    };

    return (
        <Box maxW={'md'} mx={'auto'} mt={10}>
            {/*Input에 required 를 쓰기위해 form으로 감싸줌*/}
            <form onSubmit={handleSave}>
            <Heading mb={6}>내 정보 수정</Heading>
            <FormControl mb={4}>
                <FormLabel>이름</FormLabel>
                <Input
                    type="text"
                    value={name}
                    /*작성하면서 생기는 e(event) 의 벨류들은 setName에 저장 (한글자씩 다)*/
                    onChange={(e) => setName(e.target.value)}
                    placeholder={"이름입력"}/>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>이메일</FormLabel>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={"이메일입력"}
                    required
                />
            </FormControl>
            {/*form 의로 감싸줬기 때문에 onClick={handleSave}를 form 태그로 옮겨주고 type을 submit으로 지정해줌*/}
            <Button colorScheme={"teal"} type="submit">
                저장
            </Button>
            </form>
        </Box>
    )
}
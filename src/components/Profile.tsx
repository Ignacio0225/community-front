
import {
    FormControl, FormLabel,
    useToast, Input,
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
} from "@chakra-ui/react"

import React, {useEffect, useState} from "react";


interface ProfileModalProps{
    isOpen:boolean;
    onClose:()=>void;
}

export default function Profile({isOpen:isProfileOpen, onClose:onProfileClose}:ProfileModalProps){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
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
    const handleSave = async (e:React.FormEvent)=>{
        e.preventDefault();
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
            if(!res.ok) {
                //중복 이름일경우 에러메세지 만들어줌
                const errorData = await res.json();
                if(errorData.name){
                    toast({
                        title:"이미 사용중인 이름입니다.",
                        description:errorData.name.join(","),
                        status:"error",
                        duration:3000,
                        isClosable:true,
                    });
                    //이외에 다른 에러시 다른에러 발생
                } else {
                    throw new Error("수정 실패");
                }
                return;
            }
            // 성공시 메세지전송
            toast({
                title:"수정 성공",
                status:"success",
                isClosable:true,
            });
            // 성공시 모달 종료
            onProfileClose();
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
        <Modal isOpen={isProfileOpen} onClose={onProfileClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>내 정보 수정</ModalHeader>
                <ModalCloseButton/>
                <form onSubmit={handleSave}>
                <ModalBody>
                    <FormControl>
                        <FormLabel>사용자 이름</FormLabel>
                                {/*Input 사용자 입력 필드*/}
                                <Input
                                        type="text"
                                        placeholder={"이름을 입력하세요"}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                />
                    </FormControl>
                        <FormControl mt={4}>
                                <FormLabel>E-mail</FormLabel>
                                    <Input
                                    type={"email"}
                                    placeholder={"E-mail 입력하세요"}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    />
                        </FormControl>
                    <ModalFooter>
                        <Button type="submit" mr={3} colorScheme={'teal'}>수정</Button>
                        <Button onClick={onProfileClose} colorScheme={'red'}>취소</Button>
                    </ModalFooter>
                </ModalBody>
                    </form>
            </ModalContent>
        </Modal>
    )
}
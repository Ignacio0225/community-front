import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    ModalCloseButton,Button, FormControl,FormLabel,Input,useToast,Box,Textarea
} from "@chakra-ui/react";


import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';


// 타입 스크립트로 인해 isOpen과 onClose가 뭔지 알려줘야함
interface UploadPostProps{
    isOpen:boolean;
    onClose:()=>void;
}


//모달 + 로그인 기능을 하나의 컴포넌트로 정의
export default function UploadPostModal({isOpen:isUpLoadModalOpen,onClose:onUpLoadModalClose}:UploadPostProps) {

    const [subject, setSubject] = useState(""); //유저네임 저장
    const [poster, setPoster] = useState(""); //비빌번호 저장
    const [description, setDescription] = useState("");

    // useToast 알림창 (성공,에러 등 메시지 띄우기)
    const toast = useToast(); //에러 메세지 보여줌
    const navigate = useNavigate(); //페이지 이동
    // 유저 정보(현재 접속자 이름)를 받아오기 위해 useEffect한번 사용
    useEffect(()=>{
        // 토큰으로 현재 유저 검증
        const token = localStorage.getItem("access");
        if(!token) return;
            fetch("http://localhost:8000/api/v1/user/me/",{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res)=>{
            if(!res.ok) throw Error("로그인 하세요");
            return res.json();
        })
                // 받아온 json 에서 username을 setPoster에 넣어줌
                .then((data)=>{
                    setPoster(data.username);
                })
        .catch(()=>{
                toast({
                    title:"게시판 불러오기 실패",
                    status:"error",
                    duration:3000,
                    description:"오류입니다 다시확인해주세요",
                    isClosable:true,
                })
            })
    },[]);

    //로그인 요청 함수
    const postUpLoad = async (e:React.FormEvent)=>{
        e.preventDefault(); //전체 새로고침 방지
        // 로그인된 유저 검증
        const token = localStorage.getItem("access");
        if(!token) {
            toast({
                title:"로그인하세요",
                status:"warning",
                isClosable:true,
            });
            return;
        }try {
            // 포스트 해주는 axios 사용 await로 백엔드에 포스트 될때까지 기다려줌
            await axios.post("http://localhost:8000/api/v1/posts/", {
                // 포스트하길 원하는것 설정
                subject: subject,
                description: description,
            },{
                // 정보를 json 형태로 전달해주기 위해 type을 json으로 설정해줌 , 밑에는 유저 인증
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${localStorage.getItem("access")}`,
                }
            });

            toast({
                title:"upload success", // 성공 메세지
                status:"success", // 성공시 초록색
                duration:3000, // 3초간 표시
                isClosable:true, // 닫기 버튼 표시
            });

            // 로그인에 성공하면 아래 명령실행
            onUpLoadModalClose(); //모달 닫기
            window.location.reload();// 로그인 성공하면 자동으로 새로고침 해줌(로그인 된걸보이기위함)
            navigate("/"); //홈으로 이동

            //실패시 아래명령 실행
        } catch (err) {
            toast({
                title:"upload failed", //실패 메세지
                status:"error", // 실패시 빨간색
                duration:3000, // 3초간 표시
                isClosable:true, // 닫기 버튼 표시
            });
        }
    };
    return (
        <Box>
            <Modal isOpen={isUpLoadModalOpen} onClose={onUpLoadModalClose}>
                <ModalOverlay/>
            <ModalContent>
                <ModalHeader>게시글작성</ModalHeader>
                <ModalCloseButton/>
                <form onSubmit={postUpLoad}>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>제목</FormLabel>
                            <Input
                                type="text"
                                placeholder={"제목을 작성하세요"}
                                value={subject}
                                onChange={(e)=>setSubject(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>작성자</FormLabel>
                            {/*유저는 변경할 수 없이 유져 정보에서 받아온 poster = data.username 을 넣어줌*/}
                            <Input
                                type="text"
                                value={poster}
                                isReadOnly
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>내용</FormLabel>
                            {/*chakra ui의 대형 input이라고 생각 하면됨*/}
                            <Textarea
                                rows={10}
                                placeholder={"내용을 작성하세요"}
                                value={description}
                                onChange={(e)=>setDescription(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={"teal"} mr={3} type={"submit"}>
                            작성
                        </Button>
                        <Button onClick={onUpLoadModalClose}>취소
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
            </Modal>
        </Box>
    )

}
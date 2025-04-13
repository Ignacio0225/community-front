import {createBrowserRouter} from "react-router-dom"
import Root from "./components/Root"
import NotFound from "./routes/NotFound.tsx";
import Home from "./routes/Home.tsx";
import Post from "./routes/Post.tsx";


const router = createBrowserRouter([{
    path: "/",
    element: <Root />,
    errorElement:<NotFound/>,
    children:[
        {
            path:"",
            element:<Home/>,
        },
        {
            path:"/post/:id",
            element:<Post/>
        },
    ]
},
]);

export default router;
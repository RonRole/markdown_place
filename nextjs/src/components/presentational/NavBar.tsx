import { AppBar, AppBarProps, Button, Container, ContainerProps, MenuItem, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export type LinkSrc = {
    path: string,
    display: string,
}

export type NavBarProps = {
    containerProps?: ContainerProps,
} & AppBarProps;

const links: LinkSrc[] = [
    {path:'/test', display:'TEST'}
]

export default function NavBar({children, containerProps, ...props}: NavBarProps) {
    return (
        <>
            <AppBar {...props}>
                <Toolbar>
                    <Container sx={{display:'flex'}} {...containerProps}>
                        <Typography sx={{mr:2}} variant="h6" component={Link} href='/'>Sawai Kei</Typography>
                        {links.map((linkSrc, i)=>(
                            <Link key={i} href={linkSrc.path} passHref>
                                <Button sx={{color:'white'}}>{linkSrc.display}</Button>
                            </Link>
                        ))}
                    </Container>
                </Toolbar>
            </AppBar>
            {children}
        </>
    )
}
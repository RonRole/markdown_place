import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material"
import Link from "next/link"
import { LogoutButton } from "./LogoutButton"

export type LinkSrc = {
    path: string,
    display: string,
}

export type NavBarProps = {
    children: React.ReactNode,
}


const links: LinkSrc[] = [
    {path:'/test', display:'TEST'}
]

export function NavBar({children}: NavBarProps) {
    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Container sx={{display:'flex'}} maxWidth='xl' disableGutters>
                        <Typography sx={{mr:2}} variant="h6" component={Link} href='/'>Sawai Kei</Typography>
                        {links.map((linkSrc, i)=>(
                            <Link key={i} href={linkSrc.path} passHref>
                                <Button sx={{color:'white'}}>{linkSrc.display}</Button>
                            </Link>
                        ))}
                        <LogoutButton />
                    </Container>
                </Toolbar>
            </AppBar>
            {children}
        </>
    )
}
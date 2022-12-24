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
    {path:'/articles', display:'記事一覧'},
]

export function NavBar({children}: NavBarProps) {
    return (
        <>
            <AppBar position='sticky'>
                <Toolbar sx={{flexGrow:1}}>
                    <Container sx={{display:'flex', flexGrow: 1}} maxWidth='xl' disableGutters>
                        <Typography sx={{mr:2}} variant="h6" component={Link} href='/'>Sawai Kei</Typography>
                        {links.map((linkSrc, i)=>(
                            <Link key={i} href={linkSrc.path} passHref>
                                <Button sx={{color:'white'}}>{linkSrc.display}</Button>
                            </Link>
                        ))}
                    </Container>
                    <LogoutButton sx={{whiteSpace:'nowrap'}} />
                </Toolbar>
            </AppBar>
            {children}
        </>
    )
}
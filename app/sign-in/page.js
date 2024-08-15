import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import Link from "next/link";

export default function SignUpPage(){
    return <Container maxWidth="sm">
        <AppBar position="static" sx={{backgroundColor: "3f51b5"}}>
            <Toolbar variant="h6" sx={{flexGrow: 1}}>Flashcard Saas</Toolbar>
            <Button color="inherit">
                <Link href="/login" passHref>
                    Login
                </Link>
            </Button>
            <Button color="inherit">
                <Link href="/login" passHref>
                    Sign Up
                </Link>
            </Button>
        </AppBar>

        <Box>
            {/* ---------I stopped here------- */}
        </Box>
    </Container>
}
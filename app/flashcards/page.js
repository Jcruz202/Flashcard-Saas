'use client'
import { db } from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { AppBar, Card, CardActionArea, CardContent, Container, Grid, Toolbar, Typography, Box } from "@mui/material"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Fade from '@mui/material/Fade';

export default function Flashcards(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [fadeOut, setFadeOut] = useState(false);
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards(){
            if( !user ) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else{
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || ! isSignedIn){
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }
    const handleGoHome = () =>{
        router.push('/')
    }
    const handleGoBack = () =>{
        router.push('/generate')
    }

    return (
        <Container 
            maxWidth={false} 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                backgroundColor: '#dad7cd',
            }}
            disableGutters
        >
        <Fade in={!fadeOut} timeout={500}>
            <div>
        <Box sx={{ flex: '1 0 auto' }}>
            <AppBar position="static" sx={{ backgroundColor: '#588157'}}>
                    <Toolbar>
                    <Typography 
                        variant="h6"  
                        style={{flexGrow: 1, cursor: 'pointer'}} 
                        onClick={handleGoHome}
                        >
                        Study Buddy
                        </Typography>
                    <Box 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
                        onClick={handleGoBack}
                    >
                        <ArrowBackIcon style={{ marginRight: 4 }} />
                        <Typography>Generate Cards</Typography> 
                    </Box> 
                    </Toolbar>
            </AppBar>
            <Box sx={{paddingLeft: 3, paddingRight: 3}}>
            <Grid
            container
            spacing={3}
            sx={{mt: 4, mb: 4}}>
                {flashcards.map((flashcard, index)=>(
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        backgroundColor: '#f1faee',
                        transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: 3,
                            }
                        }}>
                        <CardActionArea 
                        onClick={() => {
                            handleCardClick(flashcard.name)
                        }}
                        >
                            <CardContent>
                                <Typography variant="h6">
                                    {flashcard.name}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                ))}
            </Grid>
            </Box>
            </Box>
            </div>
      </Fade>
                  {/* -------------------------------------------------------------- */}
            <Box
                component="footer"
                sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: '#588157',
                textAlign: 'center',
                }}
            >
                <Typography variant="body2" color="text.secondary">
                © 2024 Study Buddy
                </Typography>
            </Box>
        </Container>
    )
}
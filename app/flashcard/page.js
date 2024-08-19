'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Container,Grid, Toolbar, Typography } from "@mui/material"
import { useResponsiveFont } from '../hooks/useResponsiveFont';
import { useRouter } from "next/navigation"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [frontFontSize, frontTextRef] = useResponsiveFont(20);
    const [backFontSize, backTextRef] = useResponsiveFont(20);
    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    const router = useRouter()

    useEffect(() => {
        async function getFlashcard(){
            if( !search || !user ) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()})
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || ! isSignedIn){
        return <></>
    }
    const handleGoHome = () =>{
        router.push('/')
    }
    const handleGoBack = () =>{
        router.push('/flashcards')
    }

    return(
        <Container maxWidth="100vw" sx={{ backgroundColor: '#dad7cd', minHeight: '100vh' }} disableGutters>
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
                        <Typography>Go Back</Typography> 
                    </Box>           
                </Toolbar>
            </AppBar>
            <Box sx={{paddingLeft: 3, paddingRight: 3}}>
            <Box sx={{
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid',
                borderColor: '344e41',
                borderRadius: 2,
                mt: 5
                }}>
            <Typography variant="h4" sx={{p:2, color: "#344e41"}}>{search}</Typography>
            </Box>
            <Grid container spacing={3} sx={{mt: 2, mb: 4}}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea 
                                    onClick={() =>{
                                    handleCardClick(index)
                                    }}>
                                        <CardContent>
                                            <Box sx={{
                                                perspective: '1000px',
                                                '& > div':{
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                    transform: flipped[index]
                                                    ? 'rotateY(180deg)'
                                                    : 'rotateY(0deg)',
                                                },
                                                '& > div > div':{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                    overflow: 'hidden', // Add this to prevent text overflow
                                                },
                                                '& > div > div:nth-of-type(2)':{
                                                    transform: 'rotateY(180deg)',
                                                },
                                            }}>
                                                <div>
                                                    <div>
                                                        <Typography 
                                                            ref={frontTextRef} 
                                                            variant="h5" 
                                                            component="div" 
                                                            sx={{ 
                                                                fontSize: `${frontFontSize}px`, 
                                                                textAlign: 'center',
                                                                wordWrap: 'break-word',
                                                                overflowWrap: 'break-word',
                                                                hyphens: 'auto',
                                                                maxHeight: '100%',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography 
                                                            ref={backTextRef} 
                                                            variant="h5" 
                                                            component="div" 
                                                            sx={{ fontSize: `${backFontSize}px`, textAlign: 'center' }}
                                                        >
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
            </Grid>
            </Box>
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
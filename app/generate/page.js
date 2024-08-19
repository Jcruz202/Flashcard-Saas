
'use client'
import { db } from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { AppBar, Box, Button, Card, CardActionArea, CardContent, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material"
import { collection, doc, getDoc, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useResponsiveFont } from '../hooks/useResponsiveFont';
import Fade from '@mui/material/Fade';

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fadeOut, setFadeOut] = useState(false);
    const router = useRouter()
    const [frontFontSize, frontTextRef] = useResponsiveFont(20);
    const [backFontSize, backTextRef] = useResponsiveFont(20);
    

    const handleSubmit = async () => {
        setLoading(true)
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then((data) => {
            setFlashcards(data)
            setLoading(false)
        })
        .catch((error) => {
            console.error('Error:', error)
            setLoading(false)
        })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        if (!isSignedIn) {
            alert('The user must be logged in to save Flashcards')
            return
        }
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleGoHome = () =>{
        router.push('/')
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)
        
        if (docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)){
                alert('Flashcard collection with the same name already exists.')
                return
            }
            else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else{
            batch.set(userDocRef, {flashcards: {name}})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        });

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return(
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
        </Toolbar>
      </AppBar>
      <Box sx={{paddingLeft: 3, paddingRight: 3}}>
        <Box sx={{
            mt: 4, mb:6, display:'flex', flexDirection:'column', alignItems: 'center'
        }}>
            <Typography variant="h4" gutterBottom> Generate Flashcards</Typography>
            <Paper sx={{p:4, width: '100%'}}>
            <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{
                    mb: 2,
                    backgroundColor: '#f1faee',
                    '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: '#588157',
                    },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                    color: '#588157',
                    },
                }}
                />
                <Button 
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                    sx={{mt:2, backgroundColor: '#588157' , '&:hover': {backgroundColor: '#a3b18a',},}}
                >
                    {loading ? 'Generating...' : 'Submit'}
                </Button>
            </Paper>
        </Box>
        {flashcards.length > 0 && (
            <Box sx={{mt:4}}>
            <Typography variant="h5" gutterBottom>Flashcards Preview</Typography>
            <Grid container spacing = {3}>
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
                                            overflow: 'hidden',
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
            <Box sx={{mt:4, display:'flex', justifyContent:'center'}}>
                <Button variant="contained" color="secondary" onClick={handleOpen} sx={{mb: 2, backgroundColor: '#344e41', '&:hover': {backgroundColor: '#a3b18a',},}}>
                    Save
                </Button>
            </Box>
        </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
                <DialogContentText>Please enter a name for your flashcards collection</DialogContentText>
                <TextField
                autoFocus
                margin="dense"
                label= "Collection Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: '#588157',
                    },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                    color: '#588157',
                    },}}/>
            </DialogContent>
            <DialogActions>
                <Button sx={{ color: '#344e41'}} onClick={handleClose}>
                    Cancel
                </Button>
                <Button sx={{ color: '#344e41'}} onClick={saveFlashcards}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
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
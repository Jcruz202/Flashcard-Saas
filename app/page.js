'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation"
import { POST } from "./api/checkout_session/route";

export default function Home() {
  const router = useRouter()

  const handleGenerate=()=> {
    router.push('/generate')
  }
  const handleMyFlashcards = () =>{
    router.push('/flashcards')
  }

  const handleSubmit = async () =>{
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000'
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error){
      console.warn(error.message)
    }
  }
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Study Buddy</title>
        <meta name="description" contents= "Create flashcard form your text" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6"  style={{flexGrow: 1}}>Study Buddy</Typography>
          <SignedIn>
            <Button variant="h4" onClick={() => {handleMyFlashcards()}}>My FlashCards</Button>
          </SignedIn>
          <SignedOut>
            <Button color = "inherit" href="/sign-in">Login</Button>
            <Button color = "inherit" href="/sign-up">Sign up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{textAlign:'center', my: 4,}}>
        <Typography variant="h2" gutterBottom>Welcome to Study Buddy</Typography>
        <Typography variant="h5" gutterBottom>
          {''}
          The easiest way to make flashcard from your text
        </Typography>
        <Button variant="contained" color="primary" sx={{mt:2}} onClick={() => {handleGenerate()}}>Get Started</Button>
      </Box>

      <Box sx ={{my: 6}}>
        <Typography variant = "h4" gutterBottom>Features</Typography>
        <Grid container spacing = {4}>
          <Grid item xs = {12} md = {4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography>
              {''}
              Simply input your text and let our software do the rest. Creating 
              flashcards has never been easier</Typography>
          </Grid>
          <Grid item xs = {12} md = {4}>
            <Typography variant="h6" gutterBottom>Smart FlashCards</Typography>
            <Typography>
              {''}
              Our AI intelligently breaks down your text into concise
              flashcards, perfect for studying</Typography>
          </Grid>
          <Grid item xs = {12} md = {4}>
            <Typography variant="h6" gutterBottom>Accessible anywhere</Typography>
            <Typography>
              {''}
              Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
          </Grid>
        </Grid>
      </Box>
      {/* -------------------------------------------------------------- */}
      <Box sx={{my: 6, textAlign:'center'}}>
      <Typography variant = "h4" gutterBottom>Pricing</Typography>
      <Grid container spacing = {4}>
          <Grid item xs = {12} md = {6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
              >
            <Typography variant="h5" gutterBottom>Basic</Typography>
            <Typography variant="h6" gutterBottom>$5 / month</Typography>
            <Typography>
              {''}
              Access to basic flashcard feature and limited storage</Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs = {12} md = {6}>
          <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
              >
            <Typography variant="h5" gutterBottom>Pro</Typography>
            <Typography variant="h6" gutterBottom>$10 / month</Typography>
            <Typography>
              {''}
              Unlimited flashcards and storage, with priority support.</Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

import axios from 'axios';
import { signIn, useSession } from 'next-auth/react'
import { api } from '../../services/api';
import { getStripJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton ({ priceId }:SubscribeButtonProps) {
    const session = useSession()

    async function handleSubscribe() {
        if(!session) {
            signIn('github')
            return;
        }

        //axios.post('http://localhost:3000/api/subscribe').then(response => console.log(response))
        
        try {
            
            const response = await axios.post('http://localhost:3000/api/subscribe')
            
            const { sessionId } = response.data;
            
            const stripe = await getStripJs()

            await stripe.redirectToCheckout({ sessionId })
            
        } catch (err){
            alert(err.message)
        }
        

    }

    return(
        <button 
            className={styles.subscribeButton}
            onClick={() => handleSubscribe()}
        >
            Subscribe Now
        </button>
    )
}
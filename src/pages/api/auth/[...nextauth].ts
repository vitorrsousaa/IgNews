import {query as q } from 'faunadb'
import NextAuth from "next-auth/next";
import GithubProvider from 'next-auth/providers/github'
import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read: user'
        }
      }
    })
  ],
  callbacks: {
    async session(session) {

      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'), //Criar esse index no fauna Db
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'), //criar esse index no fauna
                'active'
              )
            ])
          )
        )
  
  
        return {
          ...session,
          activeSubscription: userActiveSubscription
          
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({user}) {
      const { email } = user

       

      try {
        await fauna.query(
          q.Create(
            q.Collection('users'),
            {data: { email }}
          )
        )
        
        return true
      } catch {
        return true
      }
      
    }
  }      
})


/* 

CÓDIGO SCRIPT PARA NÃO DUPLICAR USUÁRIO

        (
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              {data: { email }}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

*/
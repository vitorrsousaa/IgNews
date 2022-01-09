import Link from 'next/link';
import React from 'react';
import { ActiveLink } from '../ActiveLink';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';

export function Header () {

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="Logo-ignews" />
                <nav>
                    <ActiveLink href='/' activeClassName={styles.active}>  
                        <a  >Home</a>
                    </ActiveLink>
                    <ActiveLink href='/posts' activeClassName={styles.active}>  
                        <a >Posts</a>
                    </ActiveLink>
                    
                </nav>
                <SignInButton   />
            </div>

        </header>
    )
}
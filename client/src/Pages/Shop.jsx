import React from 'react'
import { Hero } from '../Components/Hero/Hero'
import { Popular } from '../Components/Popular/Popular'
import { Offers } from '../Components/Offers/Offers'
import { NewCollecions } from '../Components/NewCollections/NewCollecions'
import {NewsLetter} from  '../Components/NewsLetter/NewsLetter'
import ChatbotWidget from "../Components/ChatbotWidget/ChatbotWidget.jsx";

export const Shop = () => {
  return (
    <div>
        <Hero/>
        <Popular/>
        <Offers/>
        <NewCollecions/>
        <NewsLetter/>
        <ChatbotWidget />
    </div>
  )
}

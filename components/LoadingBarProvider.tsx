'use client'


// import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import HolyLoader from "holy-loader";

export default function LoadingBarProvider() {
  return (
    <HolyLoader
      color="#9b9b9b"
      height="2px"
    />
  )
}
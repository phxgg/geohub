import { LightBulbIcon } from '@heroicons/react/outline'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { MapPreviewCard } from '../../components/Home/MapPreviewCard'
import { Navbar, Layout, Sidebar } from '../../components/Layout'
import { Icon, Pill } from '../../components/System'

const ProfilePage: NextPage = () => {
  

  
  return (
    <>
    <Navbar />
      <Layout hasSidebar>
        <div>
          <Sidebar />
        </div>

        <main>
          
        </main>
       
       
      </Layout>
      </>
  )
}

export default ProfilePage

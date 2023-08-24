import { lazy } from "react"
import { Route, Routes } from "react-router-dom"


const SaveTabForm = lazy(() => import("~popup_pages/SaveTabForm"))
const TabGroups = lazy(() => import("~popup_pages/TabGroups"))
import Tabs from '../popup_pages/Tabs'


// const Tabs = lazy(() => import("~popup_pages/Tabs"))

// {<Route path="/groups/:id" element={<Tabs />} />}

export const Routing = () => (
  <Routes>
    <Route path="/" element={<SaveTabForm />} />
    <Route path="/groups" element={<TabGroups />} />
    <Route path="/tabs" element={<Tabs />} />
  </Routes>
)
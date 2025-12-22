import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";

import { router } from "@/router";

import "@patternfly/react-core/dist/styles/base.css"
import "@/styles/theme.css"
import { AlertsAnchor } from './ui/util/AlertsAnchor';


let root = document.getElementById('root')!
createRoot(root)
    .render(
        <StrictMode>
            <AlertsAnchor>
                <RouterProvider router={router} />
            </AlertsAnchor>
        </StrictMode>,
    )

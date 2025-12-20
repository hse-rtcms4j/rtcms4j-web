import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";

import { keycloak } from "@/auth/keycloak";
import { router } from "@/router";

import "@patternfly/react-core/dist/styles/base.css"
import "@/styles/theme.css"


await keycloak.init({
    onLoad: "login-required",
});

let root = document.getElementById('root')!
createRoot(root)
    .render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>,
    )

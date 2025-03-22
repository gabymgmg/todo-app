/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/login.js":
/*!*************************!*\
  !*** ./public/login.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst loginForm = document.getElementById('loginForm');\nconst errorMessageElement = document.getElementById('error-message'); // Declare it here\nconst logoutButton = document.getElementById('logoutButton');\n\n\ninstance.interceptors.response.use(\n    (response) => {\n        return response; // Successful response\n    },\n    async (error) => {\n        const originalRequest = error.config;\n\n        if (error.response && error.response.status === 401) {\n            if (cookieExists('refreshToken')) {\n                try {\n                    await refreshAccessToken();\n                    return instance(originalRequest); // Retry request\n                } catch (refreshError) {\n                    // Refresh failed, redirect to login\n                    clearCookiesAndRedirect();\n                    return Promise.reject(refreshError);\n                }\n            } else {\n                // No refresh token, redirect to login\n                clearCookiesAndRedirect();\n                return Promise.reject(error);\n            }\n        }\n\n        return Promise.reject(error); // Other errors\n    }\n);\n\nasync function refreshAccessToken() {\n    try {\n        const response = await instance.post('/refreshToken');\n        if (response.status !== 200) {\n            throw new Error('Refresh token failed');\n        }\n    } catch (error) {\n        throw error;\n    }\n}\n\nfunction cookieExists(name) {\n    return document.cookie.split(';').some(cookie => cookie.trim().startsWith(`${name}=`));\n}\n\nfunction clearCookiesAndRedirect() {\n    document.cookie = \"jwt=; max-age=0; path=/;\";\n    document.cookie = \"refreshToken=; max-age=0; path=/;\";\n    window.location.href = '/login';\n}\n \n// Login form handling\nasync function handleLogin(event) {\n    event.preventDefault();\n    const credentials = Object.fromEntries(new FormData(loginForm));\n    console.log('Attempting login with:', credentials);\n\n    try {\n        const response = await instance.post('/login', credentials);\n\n        if (response.status === 200) {\n            window.location.href = '/dashboard';\n            return;\n        }\n\n    } catch (error) {\n        if(error.response && error.response.status === 401){\n            console.log('login failed', error.response)\n            displayError(error.response.data.message || 'Login failed.');\n        } else {\n            displayError('An unexpected error occurred.');\n            console.error('Login error:', error);\n        }\n    }\n}\n\nfunction displayError(message) {\n    errorMessageElement && (errorMessageElement.textContent = message, errorMessageElement.style.display = 'block');\n}\n\nloginForm && loginForm.addEventListener('submit', handleLogin);\n\nlogoutButton.addEventListener('click', async () => {\n    try {\n        const response = await fetch('/logout', {\n            method: 'GET'\n        });\n\n        if (response.ok) {\n            window.location.href = '/login';\n        } else {\n            console.error('Logout failed:', response.status);\n            alert('Logout failed.');\n        }\n\n    } catch (error) {\n        console.error('Logout error:', error);\n        alert('An error occurred during logout.');\n    }\n});\n\n//# sourceURL=webpack://todoapp/./public/login.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/login.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor() { }

  get(name: string, ...args: Array<any>): string {
    if (name === 'swordold') {
      let c1 = args[0] ? args[0].slice(1) : 'ffffff'
      return `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 445.167 445.167'%3E%3Cpath fill='%23${c1}' transform='rotate(-45 222 222)' d='M341.096 330.36l-11.788-25.336c-4.408-9.48-14.788-16.102-25.244-16.102h-33.804V70.595c0-5.453-2.346-12.943-5.457-17.423l-33.55-48.314C229.109 1.771 225.95 0 222.584 0s-6.526 1.771-8.67 4.858l-33.55 48.313c-3.11 4.479-5.456 11.97-5.456 17.423v218.328h-33.804c-10.453 0-20.833 6.619-25.243 16.097L104.07 330.36c-4.66 10.016-0.318 21.911 9.696 26.57c10.014 4.659 21.91 0.319 26.57-9.695l8.52-18.313h41.912l8.426 40.698c-10.87 7.47-18.015 19.985-18.015 34.142c0 22.83 18.574 41.404 41.405 41.404c22.831 0 41.405-18.574 41.405-41.404c0-14.157-7.145-26.672-18.015-34.142l8.425-40.698h41.911l8.521 18.313c3.39 7.285 10.606 11.568 18.146 11.567c2.824 0 5.695-0.602 8.425-1.872C341.416 352.271 345.757 340.376 341.096 330.36z'/%3E%3C/svg%3E`
    } else if (name === 'circle') {
      let c1 = args[0] ? args[0].slice(1) : 'ffffff'
      let c2 = args[1] ? args[1].slice(1) : 'ffffff'
      return `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100'%3E %3Ccircle cx='50' cy='50' r='45' fill='%23${c1}' stroke='%23${c2}' stroke-width='10px' /%3E%3C/svg%3E`
    } else if (name === 'triangle') {
      let c1 = args[0] ? args[0].slice(1) : 'ffffff'
      let c2 = args[1] ? args[1].slice(1) : 'ffffff'
      return `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100'%3E %3Cpolygon points='50 12 10 90 90 90' fill='%23${c1}' stroke='%23${c2}' stroke-width='10px' /%3E%3C/svg%3E`
    } else if (name === 'square') {
      let c1 = args[0] ? args[0].slice(1) : 'ffffff'
      let c2 = args[1] ? args[1].slice(1) : 'ffffff'
      return `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100'%3E %3Crect x='5' y='5' width='90' height='90' fill='%23${c1}' stroke='%23${c2}' stroke-width='10px' /%3E%3C/svg%3E`
    } else if (name === 'explosion') {
      let c1 = args[0] ? args[0].slice(1) : 'ffffff'
      let c2 = args[1] ? args[1].slice(1) : 'ffffff'
      return `data:image/svg+xml,%3Csvg width='512px' height='512px' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon fill='%23${c1}' stroke='%23${c2}' stroke-width='4px' points='5 25 39 33 24 6 55 29 74 10 67 36 96 35 72 53 98 73 67 69 74 90 57 75 44 99 37 70 10 80 25 61 5 57 26 50' /%3E%3C/svg%3E`
    } else if (name === 'arrow') {
      let c1 = args[0] ? args[0].slice(1) : 'ff8345'
      let c2 = args[1] ? args[1].slice(1) : 'dddddd'
      let c3 = args[2] ? args[2].slice(1) : 'dddddd'
      let c4 = args[3] ? args[3].slice(1) : '000000'
      return `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 24 70'%3E%3Cg transform='translate(-14 13) rotate(-135 26 26)'%3E%3Cpolygon fill='%23${c1}' style='filter:drop-shadow(0px 0 3px %23${c4})' points='13.76 16.518 36.663 39.421 39.491 36.593 16.126 13.397 14.326 14.256'/%3E%3Cpolygon fill='%23${c2}' style='filter:drop-shadow(0px 0 3px %23${c4})' points='35.637 37.566 36.737 46.366 53 52.73 46.636 36.466 37.836 35.366'/%3E%3Cpath fill='%23${c3}' style='filter:drop-shadow(0px 0 3px %23${c4})' d='M6 16.27v2h2v2.036l10-0.036v-2l2-1v-8h-2v-2h-2v-3h-2v-2h-2l0-2H8v8H0v4h2v2h2v2H6z'/%3E%3C/g%3E%3C/svg%3E`
    } else if (name === 'horse') {
      let c1 = args[0] ? args[0].slice(1) : 'ff0000'
      let c2 = args[1] ? args[1].slice(1) : '333333'
      let c3 = args[2] ? args[2].slice(1) : 'BC8754'
      return `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 511.999 511.999'%3E%3Cpath fill='%23${c3}' d='M282.79 352.83h102.83c30.575 0 57.028-21.281 63.577-51.147l0 0c5.981-27.278-6.106-55.33-30.038-69.721l-202.69-121.868V13.265c0 0-184.373 84.891-151.212 485.471h298.446C363.702 498.736 361.049 432.415 282.79 352.83z'/%3E%3Cpath fill='%23${c2}' d='M425.994 220.594l-196.26-118.001V13.265c0-4.522-2.303-8.732-6.11-11.17c-3.808-2.438-8.594-2.771-12.702-0.879c-2.036 0.938-50.371 23.813-93.927 97.84c-25.117 42.69-43.661 93.921-55.117 152.275c-14.194 72.301-17.505 155.908-9.841 248.499c0.569 6.878 6.318 12.17 13.219 12.17h298.446c3.611 0 7.063-1.471 9.565-4.075s3.833-6.112 3.689-9.72c-0.106-2.646-3.132-60.047-64.093-132.112h72.758c17.801 0 35.242-6.145 49.112-17.303c13.869-11.158 23.608-26.879 27.42-44.268C469.358 271.659 454.827 237.931 425.994 220.594z M436.24 298.843c-5.174 23.597-26.464 40.723-50.62 40.723H282.79c-5.344 0-10.167 3.207-12.234 8.136c-2.067 4.929-0.971 10.617 2.776 14.428c52.709 53.605 69.485 100.909 74.752 123.343H77.53c-14.133-194.378 25.168-308.76 61.078-370.817c23.3-40.266 48.144-64.121 64.597-76.911v72.35c0 4.654 2.441 8.969 6.429 11.367l202.691 121.868C431.395 254.796 441.006 277.105 436.24 298.843z'/%3E%3Cpath fill='%23${c2}' d='M174.604 131.372c-6.452-3.469-14.495-1.051-17.964 5.401c-28.445 52.906-61.034 149.534-54.755 309.427c0.28 7.143 6.16 12.743 13.244 12.743c0.175 0 0.353-0.003 0.529-0.011c7.321-0.288 13.02-6.454 12.734-13.775c-6.045-153.916 24.731-245.825 51.613-295.822C183.475 142.884 181.057 134.842 174.604 131.372z'/%3E%3Ccircle fill='%23${c2}' cx='261.57' cy='232.125' r='20'/%3E%3Ccircle fill='%23${c1}' cx='390' cy='287' r='75' /%3E%3Cpolygon fill='%23${c1}' points='330 170 420 220 380 360 300 360' /%3E%3C!-- %3Cline stroke='%23${c1}' stroke-width='30px' x1='330' y1='280' x2='200' y2='250' stroke-linecap='round' /%3E --%3E%3Cline stroke='%23${c1}' stroke-width='30px' x1='240' y1='130' x2='200' y2='250' stroke-linecap='round' /%3E%3Cline stroke='%23${c1}' stroke-width='30px' x1='80' y1='250' x2='200' y2='250' stroke-linecap='round' /%3E%3Cline stroke='%23${c1}' stroke-width='30px' x1='320' y1='345' x2='200' y2='250' stroke-linecap='round' /%3E%3C/svg%3E`
    } else if (name === 'bow') {
      let c1 = args[0] ? args[0].slice(1) : 'ff0000'
      let c2 = args[1] ? args[1].slice(1) : 'DFE2EF'
      let c3 = args[2] ? args[2].slice(1) : '696B6F'
      let c4 = args[3] ? args[3].slice(1) : '896F57'
      let c5 = args[4] ? args[4].slice(1) : '957856'
      let c6 = args[5] ? args[5].slice(1) : 'BC8754'
      let c7 = args[6] ? args[6].slice(1) : 'C79A5C'
      return `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 512.001 512.001'%3E%3Cpath fill='%23${c7}' d='M431.258 507.47L8.3 84.513C1.758 77.97 0.339 66.46 9.877 59.284c3.863-2.917 8.042-5.675 12.219-8.278l441.956 441.956c-2.601 4.179-5.282 8.277-8.278 12.219c-0.079 0.079-0.079 0.079 0 0.158C448.838 514.328 437.801 513.381 431.258 507.47z'/%3E%3Cpath fill='%23${c6}' d='M431.258 507.47l-213.41-213.41l23.651-23.651l222.554 222.554c-2.601 4.179-5.282 8.277-8.278 12.219c-0.079 0.079-0.079 0.079 0 0.158C448.838 514.328 437.801 513.381 431.258 507.47z'/%3E%3Cpath fill='%23${c5}' d='M455.776 505.341c-0.079-0.079-0.079-0.079 0-0.158c2.996-3.942 5.677-8.041 8.278-12.219c59.758-99.176 8.357-275.454-79.073-362.883l-1.576-1.576C295.501 42.02 120.799-8.278 22.097 51.007c-4.178 2.602-8.356 5.362-12.219 8.278C0.34 66.46 1.759 77.971 8.301 84.514c4.179 4.179 10.407 6.307 17.187 3.942c8.593-3.075 18.368-4.809 28.775-5.281c78.679-3.468 202.215 61.413 258.188 116.283l1.577 1.576c55.264 55.264 121.408 180.378 117.861 259.766c-0.473 10.407-2.208 20.182-5.124 28.775c-2.128 6.071-0.945 11.51 2.208 15.61c0.709 0.867 1.418 1.576 2.287 2.287C437.801 513.381 448.838 514.328 455.776 505.341z'/%3E%3Cpath fill='%23${c4}' d='M431.258 507.47c-0.869-0.71-1.578-1.419-2.287-2.287c-3.153-4.1-4.336-9.539-2.208-15.61c2.917-8.593 4.651-18.368 5.124-28.775c3.548-79.387-62.597-204.502-117.861-259.766l-1.576-1.576l70.953-70.953l1.577 1.576c87.43 87.43 138.831 263.707 79.073 362.883c-2.601 4.179-5.282 8.277-8.278 12.219c-0.079 0.079-0.079 0.079 0 0.158C448.838 514.328 437.801 513.381 431.258 507.47z'/%3E%3Cpolygon fill='%23${c3}' points='466.181 69.377 80.436 455.122 74.524 437.385 56.785 431.471 442.531 45.726 '/%3E%3Cpolygon fill='%23${c3}' points='74.524 437.385 80.436 455.122 466.181 69.377 454.356 57.552 '/%3E%3Cpath fill='%23${c1}' d='M194.039 435.807c4.494-4.494 6.228-10.958 4.178-16.95l-20.417-61.097l-3.233-9.855c-0.709-2.286-2.208-4.571-4.1-6.463c-1.813-1.813-4.1-3.311-6.463-4.1l-9.855-3.233l-61.097-20.417c-5.992-2.05-12.614-0.474-17.108 4.02L4.99 388.665c-8.751 8.751-5.282 23.729 6.543 27.671l45.252 15.137l17.738 5.912l5.912 17.738l15.137 45.252c3.863 11.747 18.762 15.293 27.592 6.464L194.039 435.807z'/%3E%3Cpath fill='%23${c1}' d='M123.165 506.839c-8.83 8.83-23.729 5.282-27.592-6.464l-15.137-45.252l-5.912-17.738l95.944-95.944c1.892 1.892 3.39 4.178 4.1 6.463l3.233 9.855l20.417 61.097c2.05 5.992 0.316 12.457-4.178 16.95L123.165 506.839z'/%3E%3Cpath fill='%23${c2}' d='M475.8 105.326l34.766-82.069c2.679-6.308 1.261-13.56-3.548-18.369c-4.809-4.809-12.061-6.228-18.369-3.548L406.58 36.106c-6.228 2.602-10.248 8.672-10.249 15.452v47.301c0.079 4.651 1.892 8.83 4.888 11.826c3.075 3.075 7.254 4.888 11.826 4.888h47.303C467.128 115.575 473.198 111.554 475.8 105.326z'/%3E%3Cpath fill='%23${c2}' d='M460.348 115.575h-47.301c-4.572 0-8.751-1.814-11.826-4.888L507.018 4.889c4.809 4.809 6.228 12.061 3.548 18.369L475.8 105.327C473.198 111.554 467.128 115.575 460.348 115.575z'/%3E%3C/svg%3E`
    } else if (name === 'sword') {
      let c1 = args[0] ? args[0].slice(1) : 'ff0000'
      let c2 = args[1] ? args[1].slice(1) : 'CCD1D9'
      let c3 = args[2] ? args[2].slice(1) : 'AAB2BC'

      return `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 511.992 511.992'%3E%3Cpath fill='%23${c1}' d='M181.552 371.275c0-2.828-1.125-5.546-3.125-7.546l-30.171-30.172c-4.164-4.171-10.922-4.171-15.086 0l-95.959 95.968c-4.164 4.156-4.164 10.906 0 15.078l30.171 30.171c4.164 4.155 10.921 4.155 15.085 0l95.959-95.968C180.427 376.807 181.552 374.103 181.552 371.275z'/%3E%3Cpath fill='%23${c2}' d='M490.804 96.617c1.406-1.414 2.391-3.203 2.844-5.148l18.078-78.405c0.812-3.586-0.266-7.336-2.859-9.938s-6.359-3.68-9.938-2.852l-78.404 18.062c-1.953 0.453-3.734 1.438-5.141 2.852L140.717 295.84c-4.164 4.172-4.164 10.922 0 15.094l60.335 60.342c2 2 4.719 3.125 7.546 3.125c2.828 0 5.539-1.125 7.539-3.125L490.804 96.617z'/%3E%3Cpath fill='%23FFFFFF66' d='M508.866 3.126c-2.594-2.602-6.359-3.68-9.938-2.852l-78.404 18.062c-1.953 0.453-3.734 1.438-5.141 2.852L140.717 295.84c-4.164 4.172-4.164 10.922 0 15.094l60.335 60.342c2 2 4.719 3.125 7.546 3.125c2.828 0 5.539-1.125 7.539-3.125L490.804 96.617c1.406-1.414 2.391-3.203 2.844-5.148l18.078-78.405C512.538 9.477 511.46 5.727 508.866 3.126z M501.319 10.665L483.257 89.07L208.598 363.729l-60.342-60.343L422.915 28.735L501.319 10.665L501.319 10.665L501.319 10.665z'/%3E%3Cpath fill='%23${c3}' d='M170.88 341.104c-4.164-4.172-4.164-10.921 0-15.093l193.238-193.224c4.172-4.164 10.922-4.164 15.078 0c4.172 4.164 4.172 10.922 0 15.086l-193.23 193.23C181.802 345.261 175.052 345.261 170.88 341.104z'/%3E%3Cpath fill='%2300000033' d='M77.249 389.478h90.506l10.672-10.672c2-2 3.125-4.703 3.125-7.531c0-1.078-0.164-2.125-0.469-3.125H98.584L77.249 389.478z'/%3E%3Cpath fill='%2300000033' d='M143.842 413.4H53.328l-16.117 16.125c-1.484 1.484-2.43 3.297-2.859 5.203h88.155L143.842 413.4z'/%3E%3Cpath fill='%23${c1}' d='M253.848 393.9L118.084 258.138c-4.164-4.164-10.914-4.164-15.078 0l-22.632 22.624c-4.164 4.172-4.164 10.922 0 15.078l135.763 135.764c2 2 4.711 3.125 7.539 3.125c2.836 0 5.547-1.125 7.547-3.125l22.625-22.625C258.011 404.822 258.011 398.057 253.848 393.9z'/%3E%3Cpath fill='%23${c1}' d='M85.327 469.321c0-11.391-4.438-22.108-12.492-30.171c-16.64-16.641-43.702-16.641-60.342 0c-8.055 8.062-12.492 18.78-12.492 30.171c0 11.39 4.438 22.108 12.492 30.171l0 0l0 0c8.062 8.062 18.773 12.5 30.171 12.5s22.109-4.438 30.171-12.5C80.89 491.43 85.327 480.711 85.327 469.321z'/%3E%3Cellipse fill='%2300000033' cx='42.664' cy='469.316' rx='10.664' ry='10.671'/%3E%3C/svg%3E`
    } else if (name === 'dashed') {
      let c1 = args[0] ? args[0].slice(1) : '333333'
      return `data:image/svg+xml,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cline stroke-width='2px' stroke='%23${c1}' x1='4' y1='4' x2='16' y2='16' stroke-linecap='round' /%3E%3C/svg%3E`
    }

    return ''
  }
}

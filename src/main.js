import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import 'primeflex/primeflex.css'
import App from './App.vue'

import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Carousel from 'primevue/carousel'
import Chart from 'primevue/chart'
import Checkbox from 'primevue/checkbox'
import Chip from 'primevue/chip'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import DataView from 'primevue/dataview'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Fieldset from 'primevue/fieldset'
import Galleria from 'primevue/galleria'
import Image from 'primevue/image'
import InlineMessage from 'primevue/inlinemessage'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import Knob from 'primevue/knob'
import Listbox from 'primevue/listbox'
import Message from 'primevue/message'
import OverlayPanel from 'primevue/overlaypanel'
import Panel from 'primevue/panel'
import PanelMenu from 'primevue/panelmenu'
import ProgressBar from 'primevue/progressbar'
import ProgressSpinner from 'primevue/progressspinner'
import Rating from 'primevue/rating'
import ScrollPanel from 'primevue/scrollpanel'
import SelectButton from 'primevue/selectbutton'
import Sidebar from 'primevue/sidebar'
import Skeleton from 'primevue/skeleton'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import Tag from 'primevue/tag'
import ToggleButton from 'primevue/togglebutton'
import ToggleSwitch from 'primevue/toggleswitch'
import Toolbar from 'primevue/toolbar'
import Tree from 'primevue/tree'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
})
app.directive('tooltip', Tooltip)
app.component('Accordion', Accordion)
app.component('AccordionContent', AccordionContent)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionPanel', AccordionPanel)
app.component('Avatar', Avatar)
app.component('Badge', Badge)
app.component('Button', Button)
app.component('Card', Card)
app.component('Carousel', Carousel)
app.component('Chart', Chart)
app.component('Checkbox', Checkbox)
app.component('Chip', Chip)
app.component('Column', Column)
app.component('DataTable', DataTable)
app.component('DataView', DataView)
app.component('Dialog', Dialog)
app.component('Divider', Divider)
app.component('Fieldset', Fieldset)
app.component('Galleria', Galleria)
app.component('Image', Image)
app.component('InlineMessage', InlineMessage)
app.component('InputSwitch', InputSwitch)
app.component('InputText', InputText)
app.component('Knob', Knob)
app.component('Listbox', Listbox)
app.component('Message', Message)
app.component('OverlayPanel', OverlayPanel)
app.component('Panel', Panel)
app.component('PanelMenu', PanelMenu)
app.component('ProgressBar', ProgressBar)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Rating', Rating)
app.component('ScrollPanel', ScrollPanel)
app.component('SelectButton', SelectButton)
app.component('Sidebar', Sidebar)
app.component('Skeleton', Skeleton)
app.component('TabPanel', TabPanel)
app.component('TabView', TabView)
app.component('Tag', Tag)
app.component('ToggleButton', ToggleButton)
app.component('ToggleSwitch', ToggleSwitch)
app.component('Toolbar', Toolbar)
app.component('Tree', Tree)
app.mount('#app')

import('./utils/aiClassifier').then(({ preloadModel }) => {
  preloadModel()
})

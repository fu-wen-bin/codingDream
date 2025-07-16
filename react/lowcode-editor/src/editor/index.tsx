import 'allotment/dist/style.css'
import { Allotment } from 'allotment'
import Header from './components/Header'
import Material from './components/Material'
import EditArea from './components/EditArea'
import Setting from './components/Setting'

export default function LowcodeEditor () {
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col">
      <div className="h-[60px] flex items-center border-b-[1px] border-[#000]">
        <Header/>
      </div>
      <Allotment>
        <Allotment.Pane preferredSize={240} minSize={200} maxSize={300}>
          <Material/>
        </Allotment.Pane>
        <Allotment.Pane>
          <EditArea/>
        </Allotment.Pane>
        <Allotment.Pane preferredSize={300} minSize={300} maxSize={500}>
          <Setting/>
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}
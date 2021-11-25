import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const imageRef = useRef(null)
  const colorPickerRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState([]);
  const [index, setIndex] =useState(-1)
  let draw_color = 'black'
  let start_background_color = 'white';


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 550;
    canvas.height = 550;
    const context = canvas.getContext("2d")
    start_background_color = 'white';
    context.fillStyle = start_background_color
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 5
    contextRef.current = context;
  }, [])

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const finishDrawing = (nativeEvent) => {
    if(isDrawing){
      contextRef.current.stroke();
      contextRef.current.closePath()
      setIsDrawing(false)
    }   

    if (nativeEvent.type !== 'mouseout' ){

      setHistory(prev => [...prev,contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height) ])
      setIndex(prevIndex => prevIndex + 1)
      console.log('initial index', index, history.length, history )
    }
   

  }

  const draw = ({nativeEvent}) => {
    if(!isDrawing) {
      return
    }
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function change_color ({nativeEvent}) {
    contextRef.current.strokeStyle = nativeEvent.target.style.background;
    draw_color = nativeEvent.target.style.background;
    const back_color =  nativeEvent.target.style.background;
    const color = back_color.substr(4,back_color.length-5);
    const rgb = color.split(',')
    const rgbObj = rgbToHex(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]))
    colorPickerRef.current.value = rgbObj;
  }

  const pickColor = ({nativeEvent}) => {
    contextRef.current.strokeStyle = nativeEvent.target.value;
  }
  const pickBrushSize = ({nativeEvent}) => {
    const value = nativeEvent.target.style.height;
    const size = Number(value.slice(0,value.length-2))
    contextRef.current.lineWidth = size;
  }
  const pickEraserSize = ({nativeEvent}) => {
    const value = nativeEvent.target.style.height;
    const size = Number(value.slice(0,value.length-2))
    contextRef.current.lineWidth = size;
    contextRef.current.lineCap = 'round'
    contextRef.current.lineJoin = 'round'
    contextRef.current.strokeStyle = 'white'
  }
  function SaveImage () {
    const imageFile = imageRef.current;
    imageFile.setAttribute('download', 'imge.png');
    imageFile.setAttribute('href', canvasRef.current.toDataURL())
  }

  function undoLast() {

    if (index <= 0) {
       contextRef.current.fillStyle = start_background_color;
       contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);  
       setIndex(-1)
       return      
    }
    
    contextRef.current.putImageData(history[index - 1], 0,0);
    setIndex(prevIndex => prevIndex - 1)
  
  }

  function clearCanvas() {
    contextRef.current.fillStyle = start_background_color;
    contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
    setHistory([]);
    setIndex(-1);
  }

function redo() {

  if(index >= history.length - 1){
    return;
  }  

  contextRef.current.putImageData(history[index + 1], 0,0);
  setIndex(prevIndex => prevIndex + 1)
 
}

  return (
    <div className='main-container'>
      <div className="logo">  
        <img src="bob-ross.png" alt='bob-ross.jpeg' style={{height:'200px' , width: '400px'}} />
        <img src="pallete.jpeg" style={{height:'100px' , width: '100px', color: 'red'}}/>
      </div>
    <div className='fild'>
      <div className='nav' style={{height: '50px', backgroundColor: 'whitesmoke', marginBottom: '5px'}}>
        <img src='redo3.png' onClick={undoLast} style={{height: '40px', width: '40px', padding: '5px', marginLeft: '1%'}}></img>
        <img src='redo3.png' onClick={redo} style={{height: '40px', width: '40px', padding: '5px', transform: 'rotateY(180deg)' }}></img>
        <img src='clear.png' onClick={clearCanvas} style={{height: '40px', width: '40px', padding: '5px'}}></img>
        <a href="#" onClick={SaveImage} ref={imageRef} download="imge.png">  
          <img src='save2.png' onClick={SaveImage} ref={imageRef} download="imge.png" style={{height: '40px', width: '40px', padding: '5px', marginLeft: '75%'}}></img>
        </a>
        
      </div>
        <div className='canvas-pallete'>
          <div className='tools'>
            <div>
              <div onClick={change_color} className='color-picker' style={{background: '#778899'}}></div>
              <div onClick={change_color} className='color-picker' style={{background: '#B0C4DE'}}></div>
            </div>
            <div>
              <div onClick={change_color} className='color-picker' style={{background: '#00FFFF	'}}></div>
              <div onClick={change_color} className='color-picker' style={{background: 'rgb(8, 158, 28)'}}></div>   
            </div>
            <div>
              <div onClick={change_color} className='color-picker' style={{background: '#800080'}}></div>
              <div onClick={change_color} className='color-picker' style={{background: '#FFC0CB'}}></div>
            </div>
            <div>
              <div onClick={change_color} className='color-picker' style={{background: '#00FF00'}}></div>
              <div onClick={change_color} className='color-picker' style={{background: '#FF1493'}}></div>     
            </div>
            <div>
              <div>
                <div onClick={change_color} className='color-picker' style={{background: '#FFFF00'}}></div>
                <div onClick={change_color} className='color-picker' style={{background: '#FF4500'}}></div>
              </div>
              <div>
                <div onClick={change_color} className='color-picker' style={{background: 'rgb(43, 31, 219)'}}></div>
                <div onClick={change_color} className='color-picker' style={{background: '#90EE90'}}></div>
              </div>
              <div>
                <div onClick={change_color} className='color-picker' style={{background: '#FF7F50'}}></div>
                <div onClick={change_color} className='color-picker' style={{background: '#FF00FF'}}></div>
              </div>
              <div>
                <div onClick={change_color} className='color-picker' style={{background: '#FFFACD'}}></div>
                <div onClick={change_color} className='color-picker' style={{background: '#9932CC'}}></div>   
              </div>
            </div>
            <input onInput={pickColor} type="color" className='color-picker' value="#ff00ff"  ref={colorPickerRef} style={{height: '50px', width:'50px'}}/>
            
            <div className="brush">   
              <img src='brush2.png' style={{height: '50px', width: '50px', marginBottom: '5px'}}/>      
              <div onClick={pickBrushSize} style={{backgroundColor: 'white', height:'20px', width: '40px', marginBottom: '.5em'}}></div>
              <div onClick={pickBrushSize} style={{backgroundColor: 'white', height:'15px', width: '40px', marginBottom: '.5em'}}></div>
              <div onClick={pickBrushSize} style={{backgroundColor:'white', height:'10px', width: '40px',  marginBottom: '.5em'}}></div>
              <div onClick={pickBrushSize} style={{backgroundColor:'white', height:'5px', width: '40px',  marginBottom: '.5em'}}></div>
              <div onClick={pickBrushSize} style={{backgroundColor:'white', height:'3px', width: '40px'}}></div>
            </div>
            <div className="brush">   
            <img src='eraser5.png' style={{height: '40px', width: '40px', marginBottom: '10px', paddingTop: '5px'}}/>      
              <div onClick={pickEraserSize} style={{backgroundColor: 'white', height:'20px', width: '30px', marginBottom: '.5em'}}></div>
              <div onClick={pickEraserSize} style={{backgroundColor: 'white', height:'15px', width: '30px', marginBottom: '.5em'}}></div>
              <div onClick={pickEraserSize} style={{backgroundColor:'white', height:'10px', width: '30px',  marginBottom: '.5em'}}></div>
            </div>
          </div>
          <canvas id='canvas'
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseOut={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
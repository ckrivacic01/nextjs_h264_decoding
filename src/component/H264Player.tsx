
type H264PlayerProps = {
    width: number,
    height: number,
    canvasRef: React.Ref<HTMLCanvasElement>
}

function H264Player(props: H264PlayerProps){
  return(
    <div>
        <canvas ref={props.canvasRef} width={props.width} height={props.height}/>
    </div>
  )

}

export default H264Player;
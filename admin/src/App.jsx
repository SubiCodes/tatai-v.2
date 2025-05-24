import './App.css'
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

function App() {

  return (
    <>
      <h1 className='text-4xl text-blue-500'>Admin</h1>
      <Button
        className='bg-blue-500 text-white hover:bg-blue-600'
        onClick={() =>
          toast.custom((t) => (
            <div
              className="bg-blue-950 text-white px-4 py-3 rounded shadow-md flex justify-between items-center"
              onClick={() => toast.dismiss(t)}
            >
              <div>
                <p className="font-semibold">Event has been created</p>
                <p className="text-blue-200 text-sm">Sunday, December 03, 2023 at 9:00 AM</p>
              </div>
              <button
                className="ml-4 bg-white text-blue-900 px-2 py-1 rounded hover:bg-blue-200"
                onClick={() => {
                  console.log("Undo")
                  toast.dismiss(t)
                }}
              >
                Undo
              </button>
            </div>
          ))

        }
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  )
}

export default App

import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'

export function Dashboard() {
  const [profileId, setProfileId] = useState<string>('')

  const handleChangeInput = (val) => {
    setProfileId(val)
  }

  return (
    <>
      <div>Dashboard</div>
      <div>{profileId}</div>
      <Input handleChange={handleChangeInput} />
      <Button
        text="xxx"
        disabled={false}
        target={`/profile/${profileId}`}
      />
    </>
  )
}

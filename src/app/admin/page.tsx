import AdminBoard from "@/components/admin/AdminBoard";
import styles from '@/components/admin/AdminBoard.module.css';

const HomeAdminPage = () => {
  return (
    <main className='p-10' >
      
      <div className={styles.adminContainer} >
      <AdminBoard />
      </div>
    </main>
  )
}

export default HomeAdminPage;
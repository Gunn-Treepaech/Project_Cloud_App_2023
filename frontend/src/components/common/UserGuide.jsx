import React from 'react';
import { Modal, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareIcon from '@mui/icons-material/Compare';
import InfoIcon from '@mui/icons-material/Info';

const UserGuide = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-guide-title"
      aria-describedby="user-guide-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 800,
        maxHeight: '85vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <HelpOutlineIcon sx={{ fontSize: 32 }} />
          <div>
            <Typography variant="h5" component="h2" fontWeight="bold">
              คู่มือการใช้งานเครื่องคำนวณสินเชื่อบ้าน
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              คำแนะนำการใช้งานแบบละเอียดสำหรับผู้ใช้งานทุกระดับ
            </Typography>
          </div>
        </Box>

        {/* Content */}
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3
        }}>
          {/* Quick Start */}
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalculateIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">เริ่มต้นใช้งานอย่างไร</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ ml: 5 }}>
                <Typography paragraph>
                  <strong>ขั้นตอนพื้นฐานเพื่อเริ่มคำนวณสินเชื่อบ้าน:</strong>
                </Typography>
                <Box component="ol" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                  <li>
                    <Typography><strong>ระบุวงเงินสินเชื่อ</strong> - กรอกจำนวนเงินกู้ของตนเอง (เช่น 1,000,000 บาท)</Typography>
                  </li>
                  <li>
                    <Typography><strong>ระบุเงินผ่อนต่อเดือน</strong> - กรอกจำนวนเงินที่สามารถผ่อนชำระได้ (เช่น 15,000 บาท)</Typography>
                  </li>
                  <li>
                    <Typography><strong>เลือกวันที่เริ่มผ่อน</strong> - เลือกวันที่คาดว่าเริ่มผ่อนชำระ</Typography>
                  </li>
                  <li>
                    <Typography><strong>เลือกธนาคาร</strong> - คลิก "เพิ่มธนาคาร" เพื่อเลือกธนาคารที่ต้องการเปรียบเทียบ</Typography>
                  </li>
                  <li>
                    <Typography><strong>ตั้งค่าดอกเบี้ย</strong> - ระบุอัตราดอกเบี้ย MRR และดอกเบี้ยคงที่ของแต่ละธนาคาร</Typography>
                  </li>
                  <li>
                    <Typography><strong>คำนวณ</strong> - คลิกปุ่ม "คำนวณเปรียบเทียบ" เพื่อดูผลลัพธ์</Typography>
                  </li>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Bank Configuration */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">การตั้งค่าธนาคาร</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ ml: 5 }}>
                <Typography paragraph>
                  <strong>ข้อมูลที่ต้องระบุสำหรับแต่ละธนาคาร:</strong>
                </Typography>
                <Box component="ol" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                  <li>
                    <Typography><strong>ธนาคาร</strong> - เลือกธนาคารจากรายการ (ธนาคารไทยพาณิชย์, กสิกรไทย, กรุงไทย, ยูโอบี)</Typography>
                  </li>
                  <li>
                    <Typography><strong>อัตราดอกเบี้ย MRR</strong> - อัตราดอกเบี้ยปัจจุบันของธนาคาร (เช่น 8.75%)</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      * MRR คือ Minimum Retail Rate หรืออัตราดอกเบี้ยขั้นต่ำที่ธนาคารกำหนด
                    </Typography>
                  </li>
                  <li>
                    <Typography><strong>ดอกเบี้ยคงที่</strong> - อัตราดอกเบี้ยที่คงที่ในช่วงแรก (เช่น 2.95%)</Typography>
                  </li>
                  <li>
                    <Typography><strong>ระยะเวลาดอกเบี้ยคงที่</strong> - เลือกระยะเวลาที่ดอกเบี้ยจะคงที่ (1-3 ปี หรือไม่มี Fixed Rate)</Typography>
                  </li>
                  <li>
                    <Typography><strong>ส่วนลด MRR (ปีที่ 2, 3+)</strong> - ส่วนลดพิเศษจาก MRR ในปีถัดๆ ไป (ถ้ามี)</Typography>
                  </li>
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#fef3c7', borderRadius: 1, border: '1px solid #f59e0b' }}>
                  <Typography variant="body2" sx={{ color: '#78350f' }}>
                    <strong>💡 เคล็ดลับ:</strong> สามารถเปรียบเทียบได้สูงสุด 4 ธนาคารพร้อมกัน เพื่อดูข้อเสนอที่ดีที่สุด!
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Understanding Results */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TimelineIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">การอ่านผลลัพธ์</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ ml: 5 }}>
                <Typography paragraph>
                  <strong>ส่วนต่างๆ ของผลลัพธ์การคำนวณ:</strong>
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    📊 สรุปการชำระเงินทั้งหมด:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
                    <Typography component="li" variant="body2">
                      <strong>ชำระเงินกู้:</strong> จำนวนเงินที่ผ่อนชำระเงินกู้ไปใน 36 เดือนแรก
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>ชำระดอกเบี้ย:</strong> ดอกเบี้ยสะสมที่ชำระไปใน 36 เดือนแรก
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>ยอดคงเหลือ:</strong> เงินกู้ที่เหลืออยู่หลังจากผ่อนชำระ 36 เดือนแรก
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>สถานะการเงิน:</strong> สถานะการชำระเงินกู้ เช่น ภาระเงินกู้ลดลง หรือ ภาระเงินกู้เพิ่มขึ้น
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    📈 ตารางการผ่อนชำระ:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
                    <Typography component="li" variant="body2">
                      <strong>งวดที่:</strong> ลำดับการผ่อนชำระ (1, 2, 3, ...)
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>เดือน/ปี:</strong> เดือนและปีที่กำหนดชำระในแต่ละงวด
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>จ่ายชำระ:</strong> ยอดเงินผ่อนรวมต่อเดือน
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>ชำระเงินกู้:</strong> ส่วนของเงินกู้ในการผ่อนชำระแต่ละงวด
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>ดอกเบี้ย:</strong> ดอกเบี้ยที่ต้องจ่ายในแต่ละงวด
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>ยอดคงเหลือ:</strong> เงินกู้ที่เหลืออยู่หลังจากผ่อนชำระในแต่ละงวด
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  <Chip label="ดอกเบี้ยค่อยๆ ลดลง" size="small" sx={{ bgcolor: '#fce7f3', color: '#9f1239', border: '1px solid #ec4899' }} />
                  <Chip label="เงินกู้ค่อยๆ เพิ่มขึ้น" size="small" sx={{ bgcolor: '#d1fae5', color: '#065f46', border: '1px solid #10b981' }} />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Comparison Features */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CompareIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">การเปรียบเทียบและเลือกธนาคาร</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ ml: 5 }}>
                <Typography paragraph>
                  <strong>วิธีการเปรียบเทียบและเลือกธนาคารที่เหมาะสม:</strong>
                </Typography>
                <Box component="ol" sx={{ pl: 3, '& li': { mb: 2 } }}>
                  <li>
                    <Typography><strong>เปรียบเทียบดอกเบี้ยรวม:</strong> ดูว่าธนาคารไหนมีดอกเบี้ยรวมต่ำสุดใน 3 ปีแรก</Typography>
                  </li>
                  <li>
                    <Typography><strong>เปรียบเทียบเงินผ่อนต่อเดือน:</strong> ตรวจสอบว่าเงินผ่อนเดือนต่ำเพียงพอต่อรายได้หรือไม่</Typography>
                  </li>
                  <li>
                    <Typography><strong>พิจารณา Fixed Rate:</strong> ดูว่าช่วง Fixed Rate นานเพียงพอหรือไม่</Typography>
                  </li>
                  <li>
                    <Typography><strong>ตรวจสอบส่วนลดพิเศษ:</strong> บางธนาคารมีส่วนลดพิเศษในปีที่ 2, 3</Typography>
                  </li>
                  <li>
                    <Typography><strong>พิจารณาความพร้อมให้บริการ:</strong> สถานที่ตั้งสาขา และบริการออนไลน์</Typography>
                  </li>
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#dbeafe', borderRadius: 1, border: '1px solid #3b82f6' }}>
                  <Typography variant="body2" sx={{ color: '#1e3a8a' }}>
                    <strong>📌 คำแนะนำ:</strong> ไม่ใช่ดอกเบี้ยต่ำสุดเสมอที่ดีที่สุด ให้พิจารณาความพร้อมในการผ่อนชำระและเงื่อนไขอื่นๆ ด้วย
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Tips and Tricks */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InfoIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">เคล็ดลับและข้อควรรู้</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ ml: 5 }}>
                <Typography paragraph>
                  <strong>ข้อมูลเพิ่มเติมที่เป็นประโยชน์:</strong>
                </Typography>

                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: '#ecfdf5', borderRadius: 1, border: '1px solid #10b981' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#065f46' }}>
                      💰 การวางแผนการเงิน
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#047857' }}>
                      - เงินผ่อนไม่ควรเกิน 30-40% ของรายได้<br/>
                      - เตรียมเงินสำรอง 3-6 เดือน<br/>
                      - คำนวณค่าใช้จ่ายอื่นๆ ที่เกี่ยวข้องกับบ้าน
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 1, border: '1px solid #3b82f6' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1e40af' }}>
                      📅 การเลือกวันเริ่มผ่อน
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#1e3a8a' }}>
                      - ควรเริ่มผ่อนหลังได้รับเงินโอน 1-2 เดือน<br/>
                      - หลีกเลี่ยงการเริ่มผ่อนในช่วงที่รายได้ไม่แน่นอน<br/>
                      - วันที่เริ่มผ่อนส่งผลต่อการคำนวณดอกเบี้ย
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: '#faf5ff', borderRadius: 1, border: '1px solid #a855f7' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#7e22ce' }}>
                      🔄 การรีเซ็ตข้อมูล
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#6b21a8' }}>
                      - ใช้ปุ่ม "รีเซ็ตข้อมูล" เพื่อเริ่มต้นใหม่<br/>
                      - ข้อมูลทั้งหมดจะถูกล้างพร้อมกัน<br/>
                      - เหมาะสำหรับการทดสอบสถานการณ์ต่างๆ
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 3 }} />

          {/* Footer */}
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>เครื่องมือคำนวณสินเชื่อบ้าน</strong> - เครื่องมือทางการเงินที่เชื่อถือได้
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              พัฒนาขึ้นเพื่อช่วยในการวางแผนการเงินสำหรับการซื้อบ้านของคุณ
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserGuide;
// src/components/CreateResumeModal.js
import React from 'react';
import { Modal, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Plus, FileText, CloudUpload } from 'react-bootstrap-icons'; 
import "./style.css"; 

// NHẬN CẢ onCreateBySteps VÀ onUploadResume
export default function CreateResumeModal({ show, handleClose, onCreateBySteps, onUploadResume }) { 
  
  const cardIconStyle = {
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    marginInline: 'auto',
    flexShrink: 0
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="px-4 py-3">
        <Modal.Title className="fw-bold">Tạo hồ sơ xin việc mới</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <Container fluid>
          <Row className="g-4 text-center align-items-stretch justify-content-center"> 
            
            {/* Cột 1: Tạo hồ sơ theo từng bước */}
            <Col md={6} className="d-flex"> 
              <Card className="flex-fill p-3 shadow-sm border-primary border-3 position-relative">
                <div className="small badge bg-danger-subtle text-danger position-absolute top-0 start-0 m-2 px-2 py-1">Khuyến Khích</div>

                <div style={{ ...cardIconStyle, backgroundColor: '#e3f2fd' }}>
                  <FileText size={40} className="text-primary" />
                </div>
                
                <h6 className="fw-bold text-dark mb-3">Tạo hồ sơ theo từng bước</h6>
                <ul className="list-unstyled text-start small text-muted px-2 flex-grow-1">
                  <li className="mb-2">Đủ **6 bước** yêu cầu để hoàn thành việc tạo hồ sơ.</li>
                  <li className="mb-2">Theo từng bước định dạng sẵn để tạo hồ sơ với thông tin chính xác.</li>
                  <li>Cơ hội để các Nhà tuyển dụng tìm thấy hồ sơ bạn **cao hơn** khi sử dụng hình thức tạo hồ sơ này.</li>
                </ul>
                
                {/* ÁP DỤNG HÀM CHUYỂN HƯỚNG */}
                <Button 
                    variant="primary" 
                    className="mt-auto px-4 w-100" 
                    size="sm"
                    onClick={onCreateBySteps} 
                >
                  <Plus className="me-2" /> Tạo ngay
                </Button>
              </Card>
            </Col>

            {/* Cột 2: Hồ sơ đính kèm */}
            <Col md={6} className="d-flex">
              <Card className="flex-fill p-3 shadow-sm">
                
                <div style={{ ...cardIconStyle, backgroundColor: '#e0f7fa' }}>
                  <CloudUpload size={40} className="text-info" />
                </div>
                
                <h6 className="fw-bold text-dark mb-3">Hồ sơ đính kèm</h6>
                <ul className="list-unstyled text-start small text-muted px-2 flex-grow-1">
                  <li className="mb-2">**4 bước** yêu cầu để hoàn thành việc tạo hồ sơ.</li>
                  <li>Bạn có thể tải lên và đính kèm file **Word, Excel hay PDF**.</li>
                  <li className="text-white">.</li>
                </ul>
                
                {/* ÁP DỤNG HÀM XỬ LÝ UPLOAD */}
                <Button 
                    variant="outline-secondary" 
                    className="mt-auto px-4 w-100" 
                    size="sm"
                    onClick={onUploadResume} 
                >
                  <Plus className="me-2" /> Tải hồ sơ lên
                </Button>
              </Card>
            </Col>
            
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { roundTo } from 'round-to';
import prettifyNumber from '../../../../../../functions/prettifyNumber';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SubRow = ({subData, isOpen}) => {

    return(
        
        <TableRow
            sx={{ "& td": { border: 0 } }}
            key={uuidv4()}
            >
            <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
                <Collapse in={isOpen} timeout="auto" unmountOnExit >
                    <Box sx={{marginTop: '1rem', marginBottom: '1rem', width: '100%'}}>
                    <Table size='small'>

                    <TableHead>
                        <TableRow key={"head"} style={{ paddingBottom: 0, paddingTop: 0 }}>
                            <TableCell sx={{fontWeight: 'bold', fontSize: '0.7rem', width: '15rem'}} >CCSR</TableCell>
                            <TableCell size="small"  align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem', minWidth: '2rem'}}>Altas ▽</TableCell>
                            <TableCell size="small"  align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Ingreso ordinario</TableCell>
                            <TableCell size="small"  align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Ingreso urgente</TableCell>
                            <TableCell size="small" align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Exitus</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {subData.map(d => {
                            return(
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={uuidv4()} >

                                    <TableCell scope="row" size="small" sx={{fontSize: '0.7rem'}}>{d.ccsr}</TableCell>
                                    <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+d.extra_discharges,0))}</TableCell>
                                    <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+d.ordinary_discharges,0))}</TableCell>
                                    <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+d.urgent_discharges,0))}</TableCell>
                                    <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+d.exitus,0))}</TableCell>

                                </TableRow>
                            )
                        })}
                        
                    </TableBody>

                </Table>
                </Box>
                
                </Collapse>
            </TableCell>
            
        </TableRow>
    )

}

const Row = ({rowData}) => {

    const [open, setOpen] = useState(false);

    return(
        <>
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: open ? '#EEF1FF' : '' }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                <TableCell scope="row" size="small" sx={{fontSize: '0.7rem', maxWidth: '8rem'}}>
                    {rowData.entity}
                </TableCell>

                <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+rowData.extra_discharges, 0))}</TableCell>
                
                <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+rowData.extra_percent, 2)) + "%"}</TableCell>
                
                <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+rowData.ordinary_discharges, 0))}</TableCell>
                
                <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+rowData.urgent_discharges, 0))}</TableCell>
                
                <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+rowData.exitus, 0))}</TableCell>
        </TableRow>
        <SubRow subData={rowData.ccsrList} isOpen={open} key={uuidv4()}/>
        </>
    );

}

export const FluxTable = ({data}) => {

    return(
        <Box sx={{height: '20rem'}}>
            <TableContainer sx={{height: '100%', width: '100%'}}>
                <Table aria-label="" size="small">
                    <TableHead>
                    <TableRow key={"head"}>
                    <TableCell sx={{fontWeight: 'bold', fontSize: '0.7rem'}}></TableCell>
                        <TableCell sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Entidad</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Altas</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>% sobre el total del hospital</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Ingreso ordinario</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Ingreso urgente</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Exitus</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map( d => (
                        <Row rowData={d} key={uuidv4()}/>
                    ) )}
                    </TableBody>
                </Table>
                </TableContainer>
            
        </Box>
    )
};